import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';
import clientSocket from '../client/clientSocket';

import {addLocaleData} from 'react-intl';
//@todo: build this automatically
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';

import RouteDefinition from './routeDefinition';

//Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


// AppContainer is a necessary wrapper component for HMR
import {AppContainer} from 'react-hot-loader';

addLocaleData([...en, ...de]);
let enhancer = applyMiddleware(thunk);
if (window.devToolsExtension) {
    enhancer = compose(enhancer, window.devToolsExtension && window.devToolsExtension());
}

// Grab the state from a global injected into server-generated HTML
const store = createStore(reducer, window.__INITIAL_STATE__, enhancer);
delete window.__INITIAL_STATE__;

ReactDOM.render(
        <Provider store={store}>
            <IntlProvider>
                <MuiThemeProvider muiTheme={getMuiTheme({userAgent: navigator.userAgent}, darkBaseTheme)}>
                    <Router>
                        <AppContainer><RouteDefinition store={store}/></AppContainer>
                    </Router>
                </MuiThemeProvider>
            </IntlProvider>
        </Provider> ,
    document.getElementById('root')
);


if (module.hot) {
    module.hot.accept('./routeDefinition', () => {
        ReactDOM.render(<RouteDefinition store={store}/>);
    });
}
clientSocket(store);