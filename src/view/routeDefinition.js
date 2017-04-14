import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';

import Home from './visitingLandmarks';

import DialogChangePassword from './dialog/changePassword';
import DialogResetPassword from './dialog/resetPassword';
import DialogLogin from './dialog/login';
import DialogProfile from './dialog/profile';
import DialogRegister from './dialog/register';

import routes from '../../config/routes';
import conditionalRoute from './conditionalRoute';


const LoggedInRoute = conditionalRoute(routes.user.login, (store) => {
    return store.getState().session.user;
});
const LoggedOutRoute = conditionalRoute(routes.root, (store) => {
    return !store.getState().session.user;
});

export default class RouteDefinition extends React.Component {

    constructor(props) {
        super(props);
        this.props.store.subscribe(() => this.forceUpdate()); //@todo: this will notice a change in the store, connecting this with redux would be nicer, but does not work for some reason
    }

    render() {

        return (
            <div id="router">
                <Route path={routes.root} component={Home}/>
                <LoggedInRoute path={routes.user.passwordChange} store={this.props.store}
                               component={DialogChangePassword}/>
                <LoggedInRoute path={routes.profile} store={this.props.store} component={DialogProfile}/>

                <LoggedOutRoute path={routes.user.login} store={this.props.store} component={DialogLogin}/>
                <LoggedOutRoute path={routes.user.register} store={this.props.store} component={DialogRegister}/>
                <LoggedOutRoute path={routes.user.resetPassword} store={this.props.store}
                                component={DialogResetPassword}/>
            </div>);
    }

}


RouteDefinition.propTypes = {
    store: PropTypes.object.isRequired,
};