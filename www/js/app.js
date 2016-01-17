import React from 'react';
import ReactDOM from 'react-dom';

// redux components
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import clientApp from './reducers/reducer';

// react-router components
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import {store} from './store'
// let store = createStore(clientApp);

// pages to render for different routes
import MapPage from './components/map-page';
import AddPointPage from './components/add-point-page';
import RegisterPage from './components/register-page';
import LoginPage from './components/login-page';
import DownloadTrackPage from './components/download-track-page';
import FilterPage from './components/filter-page';

import {init} from './db'
import {resetPoints} from './actions/point-actions';

/**
 * the App component fetches service data from the server and displays
 * a map with points for each service. Fetching hapens upon mount.
 */
class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

/* Requires cordova.js to already be loaded via <script> */
document.addEventListener('deviceready', () => {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={MapPage}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/add-point" component={AddPointPage}/>
          <Route path="/download-track" component={DownloadTrackPage}/>
          <Route path="/filter" component={FilterPage}/>
        </Route>
      </Router>
    </Provider>
  ), document.getElementById('main'));

  init().then(points => {
    store.dispatch(resetPoints(points));
  });

}, false);
