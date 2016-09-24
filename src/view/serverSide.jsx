import React from 'react';
// import ReactDOM from 'react-dom';

import {Provider} from 'react-redux'
import {createStore} from 'redux';
import {renderToString} from 'react-dom/server';
import VisitingLandmarks from './container/visitingLandmarks';
import reducer from './reducer/reducer';

import loggedInAction from './action/loggedIn';
import setLocationsAction from './action/setLocations';

export default (user, locations, userAgent) => {

    // Create a new Redux store instance
    const store = createStore(reducer);

    if (user) {
        store.dispatch(loggedInAction(user));
    }

    if (locations) {
        store.dispatch(setLocationsAction(locations));
    }

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <VisitingLandmarks radiumConfig={{userAgent}} />
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
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
         <script src="static/all.js"></script>
      </body>
    </html>
    `
}