import {IntlProvider} from 'react-intl-redux';
import {Provider as ReduxProvider} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

//Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//@todo: the key=random is a dirty hack found here https://github.com/gaearon/react-hot-loader/issues/249, but still not working

import RouteDefinition from './routeDefinition';
const Providers = (props) => {

    const Router = props.router;

    return (<ReduxProvider store={props.store}>
        <IntlProvider>
            <MuiThemeProvider muiTheme={props.muiTheme}>
                <Router {...props.routerProps}>
                    <RouteDefinition store={props.store}/>
                </Router>
            </MuiThemeProvider>
        </IntlProvider>
    </ReduxProvider>);
};

Providers.propTypes = {
    router : PropTypes.func,
    store : PropTypes.object,
    muiTheme : PropTypes.object,
    routerProps : PropTypes.object,
};

export default Providers;