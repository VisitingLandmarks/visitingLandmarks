import React from 'react';
import ReactDOM from 'react-dom';
import visitingLandmarks from './container/visitingLandmarks.js';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducer from './reducer/reducer';
import clientSocket from '../client/clientSocket.js';

// Grab the state from a global injected into server-generated HTML
const store = createStore(reducer, window.__INITIAL_STATE__, window.devToolsExtension && window.devToolsExtension());
delete window.__INITIAL_STATE__;

ReactDOM.render(
    <Provider store={store}>
        <visitingLandmarks />
    </Provider>
    , document.getElementById('root'));

clientSocket(store);
