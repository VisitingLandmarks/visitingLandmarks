import React from 'react';
import ReactDOM from 'react-dom';
import VisitingLandmarks from './container/visitingLandmarks.js';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer/reducer';
import clientSocket from '../client/clientSocket.js';

//Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

let enhancer = applyMiddleware(thunk, createLogger());
if (window.devToolsExtension) {
    enhancer = compose(enhancer, window.devToolsExtension && window.devToolsExtension());
}

// Grab the state from a global injected into server-generated HTML
const store = createStore(reducer, window.__INITIAL_STATE__, enhancer);
delete window.__INITIAL_STATE__;

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
            <VisitingLandmarks radiumConfig={{userAgent: navigator.userAgent}}/>
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));

clientSocket(store);