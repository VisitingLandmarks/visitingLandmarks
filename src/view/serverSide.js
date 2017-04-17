import config from '../../config';

import React from 'react';
import {IntlProvider} from 'react-intl-redux';
import {renderToString} from 'react-dom/server';
import {StaticRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RouteDefinition from './routeDefinition';

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
addLocaleData([...en, ...de]);

export default (store, url, userAgent) => {

    const context = {};

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <IntlProvider>
                <MuiThemeProvider muiTheme={getMuiTheme({userAgent}, darkBaseTheme)}>
                    <Router location={url} context={context}>
                        <RouteDefinition store={store}/>
                    </Router>
                </MuiThemeProvider>
            </IntlProvider>
        </Provider>
    );

    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return {
            status: 302,
            url: context.url,
        };
    }

    // Grab the initial state from our Redux store
    const initialState = store.getState();

    //and now render the page and return a 200 code
    return {
        status: 200,
        html: renderFullPage(html, initialState),
    };
};

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
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
         <script src="/static/all.js"></script>
      </body>
    </html>
    `;
}