import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';
import clientSocket from '../client/clientSocket';

import {addLocaleData} from 'react-intl';

//@todo: build this automatically based on config
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';

//Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Providers from './providers';

addLocaleData([...en, ...de]);
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
            muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}
            routerProps={{key: Math.random()}}
            router={Router}
        />,
        document.getElementById('root')
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