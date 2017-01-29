import config from '../../config';

import React from 'react';
import {renderToString} from 'react-dom/server';
import VisitingLandmarks from './container/visitingLandmarks';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

import {login} from '../redux/action/thunk/login';
import {categoriesSet} from '../redux/action/categories';
import {locationsSet} from '../redux/action/locations';
import {dialogOpen} from '../redux/action/ui';

export default (user, categories, locations, userAgent, openDialog) => {

    // Create a new Redux store instance
    const store = createStore(reducer, applyMiddleware(thunk));

    if (user) {
        store.dispatch(login(user));
    }

    if (categories) {
        store.dispatch(categoriesSet(categories));
    }

    if (locations) {
        store.dispatch(locationsSet(locations));
    }

    if (openDialog) {
        store.dispatch(dialogOpen(openDialog));
    }

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
        <link rel="stylesheet" href="/static/style.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLet}leaflet.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLetMarkerCluster}MarkerCluster.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLetMarkerCluster}MarkerCluster.Default.css">
        <script src="${config.frontendPath.leafLet}leaflet.js"></script>
        <script src="${config.frontendPath.leafLetMarkerCluster}leaflet.markercluster.js"></script>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
         <script src="/static/all.js"></script>
      </body>
    </html>
    `
}