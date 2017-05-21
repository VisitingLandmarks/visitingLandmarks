import { IntlProvider } from 'react-intl-redux';
import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const Providers = (props) => {
    const {RouteDefinition, Router} = props;

    return (<ReduxProvider store={props.store}>
        <IntlProvider>
            <MuiThemeProvider muiTheme={props.muiTheme}>
                <Router {...props.routerProps}>
                    <RouteDefinition store={props.store} />
                </Router>
            </MuiThemeProvider>
        </IntlProvider>
    </ReduxProvider>);
};

Providers.propTypes = {
    Router: PropTypes.element.isRequired,
    RouteDefinition: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired,
    routerProps: PropTypes.object.isRequired,
};

export default Providers;
