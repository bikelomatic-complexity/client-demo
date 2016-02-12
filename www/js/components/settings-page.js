import React, {Component} from 'react';
import { Layout, Header, CardText } from 'react-mdl';
import { RaisedButton } from 'material-ui';

import ACDrawer from './ac-drawer';
import SettingSwitch from './setting-switch';

import {setOnlineMode} from '../reducers/settings'
import {connect} from 'react-redux'

export class SettingsPage extends Component {

  render() {
    const {dispatch, settings} = this.props;
    return (
      <Layout fixedHeader>
        <Header title="Settings"/>
        <ACDrawer page="Settings"/>
        <div className="form-column">
          <div className="form-row">
            <div>
              <CardText style={{fontSize:'2em',fontWeight:'bold'}}>
                Sync Settings
              </CardText>
              <hr />
            </div>
          </div>
          <div className="form-row">
            <SettingSwitch id="offline-mode-switch" title="Offline Mode" checked={!settings.onlineMode} onChange={change => {
              dispatch(setOnlineMode(!change));
            } }>
              Go into offline mode so you can view your offline tiles.
            </SettingSwitch>
          </div>
          <div className="form-row">
            <SettingSwitch  id="conflict-switch"
                            title="Conflict Notifications">
              Notify me when conflicts occur with my edits
              to services.
            </SettingSwitch>
          </div>
          <div className="form-row">
            <SettingSwitch  id="wifi-switch"
                            title="Sync using WIFI" checked={true}>
              Sync edits to services when connected to the
              internet.
            </SettingSwitch>
          </div>
          <div className="form-row">
            <SettingSwitch  id="cellular-switch"
                            title="Sync using Cellular">
              Sync edits to services on cellular data.<br/>
              <i>Recommended Off</i>
            </SettingSwitch>
          </div>
          <div className="form-row">
            <RaisedButton secondary>Sync Edits Now</RaisedButton>
          </div>
          <div className="form-row">
            <div>
              <CardText style={{fontSize:'2em',fontWeight:'bold'}}>
                Other Settings
              </CardText>
              <hr />
            </div>
          </div>
          <div className="form-row">
            {/* empty form row to snap to bottom */}
          </div>
        </div>
      </Layout>
    )
  }
}

function select(state) {
  return {
    settings: state.settings.toJS()
  };
}
export default connect(select)(SettingsPage);
