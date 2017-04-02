import React, {PropTypes} from 'react';
import {Route} from 'react-router-dom';

import Home from './visitingLandmarks';

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
        <LoggedOutRoute path={routes.user.login} store={store} component={DialogLogin}/>
        <LoggedInRoute path={routes.profile} store={store} component={DialogProfile}/>
        <LoggedOutRoute path={routes.user.register} store={store} component={DialogRegister}/>
    </div>
);

RouteDefinition.propTypes = {
    store: PropTypes.object.isRequired,
};

export default RouteDefinition;