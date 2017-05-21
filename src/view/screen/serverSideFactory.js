import config from '../../../config/index';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Providers from '../providers';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
addLocaleData([...en, ...de]);

export default (RouteDefinition, assetFile, theme) => {
    return (store, url, userAgent) => {
        // context is a referenced object, allowing the router to change the url during SSR
        const context = {};

        // Render the component to a string
        const html = renderToString(
            <Providers
                store={store}
                muiTheme={getMuiTheme({userAgent}, theme)}
                routerProps={{location: url, context}}
                Router={Router}
                RouteDefinition={RouteDefinition}
            />,
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

        // and now render the page and return a 200 code
        return {
            status: 200,
            html: renderFullPage(html, initialState, assetFile),
        };
    };
};

// @todo: move to template?
const renderFullPage = (renderedHtml, initialState, assetFile) => {
    return `
    <!doctype html>
    <html>
      <head>
        <title>visitingLandmarks</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="${config.frontendPath.buildAssets}static/${assetFile}.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLet}leaflet.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLetMarkerCluster}MarkerCluster.css">
        <link rel="stylesheet" href="${config.frontendPath.leafLetMarkerCluster}MarkerCluster.Default.css">
      </head>
      <body>
        <div id="root">${renderedHtml}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
         <script src="${config.frontendPath.buildAssets}static/${assetFile}.js"></script>
      </body>
    </html>
    `;
};
