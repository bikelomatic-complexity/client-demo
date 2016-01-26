import React, { Component } from 'react'
import { Spinner, CardText } from 'react-mdl'
import { connect } from 'react-redux'
import { keys, values } from 'underscore'

import { divIcon } from 'leaflet'
import * as Leaflet from 'react-leaflet'
const { Marker, Popup, Map, TileLayer, CircleMarker, MultiPolyline, setIconDefaultImagePath } = Leaflet;
import MBTilesLayer from './mbtiles-layer';

import { selectMarker, deselectMarker, setMapCenter, setGeoLocation, setMapZoom, setMapLoading } from '../actions/map-actions';

import { Spinner, CardText } from 'react-mdl';

const noOps = function(){}; // function that does nothing

setIconDefaultImagePath('img/icons');

class PointMap extends Component {
  constructor(props) {
    super(props);
    const { mapState } = this.props;
    this.state = {
      startCenter: mapState.center,
      center: mapState.center,
      zoom: mapState.zoom,
      box: [0,0,0,0]
    }
  }

  componentDidMount() {
    const { dispatch, mapState } = this.props;
    if (mapState.loading) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const {latitude, longitude} = pos.coords;
          const coords = [latitude, longitude];
          dispatch(setGeoLocation(coords));
          dispatch(setMapCenter(coords));
          dispatch(setMapLoading(false));
          this.setState({
            startCenter: coords,
            center:coords,
            zoom:13
          });
        },
        (err) => {
          console.error(err);
          dispatch(setMapLoading(false));
        }
      )
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setMapZoom(this.state.zoom));
    dispatch(setMapCenter(this.state.center));
  }

  onMapMoved(leaflet) {
    const { dispatch } = this.props;
    const { lat, lng } = leaflet.target.getCenter();
    const { _northEast, _southWest } = leaflet.target.getBounds();
    const diffLat = Math.abs(_northEast.lat - _southWest.lat);
    const diffLng = Math.abs(_northEast.lat - _southWest.lng);
    this.setState({
      zoom:leaflet.target.getZoom(),
      center:[lat, lng],
      box:[
        _northEast.lat + diffLat,
        _northEast.lng + diffLng,
        _southWest.lat - diffLat,
        _southWest.lng - diffLng
      ]});
    dispatch(setMapCenter(this.state.center));
  }

  filterRoutes(route) {
    const { box } = this.state;
    return route.map(track=>{
      return track.filter((point, index, array)=>{
        return (((box[0] > point[0])&&(box[2] < point[0]))
          && ((box[1] > point[1])&&(box[3] < point[1])));
      })
    })
  }

  render() {
    const { dispatch, tracks, settings, mapState, children } = this.props;

    let markers = this.props.services.map((service) => {
      return (
        <Marker key={service._id} radius={10} position={service.location}
          onclick={() => {
            if (!this.props.addpoint){
              dispatch(selectMarker(service));
            }
          }}
        />
      );
    });

    let alerts = this.props.alerts.map((alert) => {
      return (
        <Marker key={alert._id} radius={10} position={alert.location}
          onclick={() => {
            if (!this.props.addpoint){
              dispatch(selectMarker(alert));
            }
          }}
        />
      );
    });

    // Display waypoints for active tracks
    const activeTracks = values(tracks).filter(track => track.active)
    const trackViews = activeTracks.map(track => {
        return (
          <MultiPolyline key={track._id} polylines={track.waypoints}
            color="#f30" opacity="0.8" />
        )
      });

    // If offline, display tile layers for tracks with available packages
    const availableTracks = values(tracks)
      .filter(track => track.status === 'available');

    const tileLayerInfo = {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attr: `&copy; <a href="http://osm.org/copyright">
              OpenStreetMap</a>contributors`
    };

    // In online mode, use tiles from OpenStreetMap. When offline, display
    // tiles from the first availble mbtiles package. If no tile packages
    // are availale when offline, display no tile layers.
    // TODO: display multiple offline tile layers concurrently
    let tileLayer;
    if(settings.onlineMode) {
      tileLayer = (
        <TileLayer
          url={tileLayerInfo.url}
          attribution={tileLayerInfo.attr} />
      );
    } else if(availableTracks.length > 0) {
      const pkg = availableTracks[0].pkg;
      tileLayer = (
        <MBTilesLayer
          pkg={pkg}
          url={tileLayerInfo.url}
          attribution={tileLayerInfo.attr} />
      );
    }

    let circleMarker = '';
    if (mapState.geolocation) {
      circleMarker = <CircleMarker center={mapState.geolocation} />
    }

    let view;
    if (mapState.loading) {
      view = (
        <div style={{margin:'auto'}}>
          <Spinner singleColor />
        </div>
      );
    } else {
      view = (
        <Map  center={this.state.startCenter}
              zoom={this.state.zoom}
              onLeafletMove={this.props.onLeafletMove}
              onLeafletMoveEnd={(leafletMap)=>{
                this.onMapMoved(leafletMap);
              }}
              onclick={() => {
                dispatch(deselectMarker());
              }} >

          { circleMarker }
          { tileLayer }

          { markers }
          { alerts }

          <MultiPolyline  polylines={this.filterRoutes(usbr20)}
                          color="#f30"
                          opacity="0.8"/>

          { trackViews }
          { children }


        </Map>
      );
    }

    return view;
  }
}

function select(state) {
  return {
    tracks: state.tracks.toJS(),
    settings: state.settings.toJS(),
    mapState: state.mapState
  };
}

PointMap.defaultProps = { onLeafletMove: noOps };

export default connect(select)(PointMap);
