import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import RouteDefinition from './routeDefinition';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../../redux/reducer/index';
import clientSocket from '../../modules/socket.io/client';

// Material UI
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import Providers from '../providers';

// @todo: build this automatically based on config
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
addLocaleData([...en, ...de]);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default (RouteDefinition, theme) => {
    let enhancer = applyMiddleware(thunk);
    if (window.devToolsExtension) {
        enhancer = compose(enhancer, window.devToolsExtension && window.devToolsExtension());
    }

// Grab the state from a global injected into server-generated HTML
    const store = createStore(reducer, window.__INITIAL_STATE__, enhancer);
    delete window.__INITIAL_STATE__;

    /**
     * render the app with an existing dom
     * @param Component
     */
    const render = (Component) => {
        ReactDOM.render(
            <Component
                store={store}
                muiTheme={getMuiTheme({userAgent: navigator.userAgent}, theme)}
                routerProps={{key: Math.random()}}
                Router={Router}
                RouteDefinition={RouteDefinition}
            />,
            document.getElementById('root'),
        );
    };

    /**
     * a wrapper so this can be called directly and when a module changes
     */
    const renderApp = () => {
        render(Providers);
    };

    if (module.hot) {
        module.hot.accept('./providers', renderApp);
    }

    renderApp();
    clientSocket(store);
};
