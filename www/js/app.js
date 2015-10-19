import React from 'react';
import ReactDOM from 'react-dom';

import Service from './components/service';
import MyMap from './components/map'

import rest from 'rest';
import mime from 'rest/interceptor/mime';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        services: [ {
          _id: "id0",
          name: "Joe's Pizzeria",
          type: "Restaurant",
          lat: 43.0848,
          lon: -77.6744
        }, {
          _id: "id1",
          name: "Joe's Whisky Bar",
          type: "Bar",
          lat: 0,
          lon: 0
        } ]
      };
  }
  componentDidMount() {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://52.3.244.0/services');
    request.onload = (response) => {
      if(request.status === 200) {
        let json = JSON.parse(request.responseText);
        this.setState({services: json});
      } else {
        console.error('error');
      }
    };
    request.send();
  }
  render() {
    return (
      <MyMap services={this.state.services} />
    )
  }
}

document.addEventListener('deviceready', () => {
  ReactDOM.render((
      <App />
  ), document.getElementById('main'));
}, false);
