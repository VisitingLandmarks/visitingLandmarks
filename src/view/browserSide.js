import React from 'react';
import ReactDOM from 'react-dom';
import VisitingLandmarks from './visitingLandmarks';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';
import clientSocket from '../client/clientSocket';

//Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

let enhancer = applyMiddleware(thunk);
if (window.devToolsExtension) {
    enhancer = compose(enhancer, window.devToolsExtension && window.devToolsExtension());
}

// Grab the state from a global injected into server-generated HTML
const store = createStore(reducer, window.__INITIAL_STATE__, enhancer);
delete window.__INITIAL_STATE__;

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
            <VisitingLandmarks />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));

clientSocket(store);