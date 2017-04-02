import React, {PropTypes} from 'react';
import {Route} from 'react-router-dom';

import Home from './visitingLandmarks';

import ResetPassword from './dialog/resetPassword';
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

const RouteDefinition = ({store}) => (
    <div id="router">
        <Route path={routes.root} component={Home}/>
        <LoggedInRoute path={routes.profile} store={store} component={DialogProfile}/>

        <LoggedOutRoute path={routes.user.login} store={store} component={DialogLogin}/>
        <LoggedOutRoute path={routes.user.register} store={store} component={DialogRegister}/>
        <LoggedOutRoute path={routes.user.resetPassword} store={store} component={ResetPassword}/>
    </div>
);

RouteDefinition.propTypes = {
    store: PropTypes.object.isRequired,
};

export default RouteDefinition;