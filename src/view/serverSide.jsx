import React from 'react';

import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {renderToString} from 'react-dom/server';
import VisitingLandmarks from './container/visitingLandmarks';
import reducer from './reducer/reducer';

import loginSuccessfulAction from './action/request/loginSuccess';
import setLocationsAction from './action/setLocations';
// import visitedLocationsAction from './action/visitedLocations';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default (user, locations, userAgent) => {

    // Create a new Redux store instance
    const store = createStore(reducer,applyMiddleware(thunk));

    if (user) {
        store.dispatch(loginSuccessfulAction(user));
    }

    if (locations) {
        store.dispatch(setLocationsAction(locations));
    }

    // if (user && user.visited) {
    //     store.dispatch(visitedLocationsAction(user.visited));
    // }

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <MuiThemeProvider muiTheme={getMuiTheme({userAgent},darkBaseTheme)}>
            <VisitingLandmarks radiumConfig={{userAgent}} />
            </MuiThemeProvider>
        </Provider>
    );

    // Grab the initial state from our Redux store
    const initialState = store.getState();
    return renderFullPage(html, initialState);
}

//@todo: move to template
function renderFullPage(html, initialState) {
    return `
    <!doctype html>
    <html>
      <head>
        <title>visitingLandmarks</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="static/style.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.0.0-rc.1.0/dist/MarkerCluster.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.0.0-rc.1.0/dist/MarkerCluster.Default.css">
        <script src="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.0.0-rc.1.0/dist/leaflet.markercluster.js"></script>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
         <script src="static/all.js"></script>
      </body>
    </html>
    `
}