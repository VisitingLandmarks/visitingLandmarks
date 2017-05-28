import React from 'react';
import PropTypes from 'prop-types';

import Admin from '../../admin/intl';

import {routes} from '../../../modules/routes';

import conditionalRoute from '../../conditionalRoute';

const AdminRoute = conditionalRoute(routes.user.login, (store) => {
    const user = store.getState().session.user;
    return user && user.isAdmin;
});

export default class RouteDefinition extends React.Component {

    componentDidMount () {
        this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate()); // @todo: this will notice a change in the store, connecting this with redux would be nicer, but does not work for some reason
    }

    componentWillUnmount () {
        this.unsubscribe();
    }

    render () {
        return (
            <div id='router'>
                <AdminRoute path={routes.admin.entry} store={this.props.store}
                    component={Admin} />
            </div>);
    }

}

RouteDefinition.propTypes = {
    store: PropTypes.object.isRequired,
};
