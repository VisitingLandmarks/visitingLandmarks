import React from 'react';
import PropTypes from 'prop-types';

import MainMap from './mainMap';
import MainMenu from './mainMenu';
import Navigator from './navigator';
import ConversionLocationVisit from './dialog/conversionLocationVisit';

import {connect} from 'react-redux';

import {logoutThunk} from '../redux/action/thunk/logout';
import visitLocationThunk from '../redux/action/thunk/visitLocation';

import {followUserSet, navigateTo, conversionLocationVisitShow} from '../redux/action/ui';

import {routes} from '../modules/routes';

/**
 * the whole frontend
 */
class VisitingLandmarks extends React.Component {

    render () {
        return (
            <div className='mainContainer'>

                <MainMap
                    key='mainMap'
                    followUser={this.props.followUser}
                    visitedLocations={this.props.visitedLocations}
                    locations={this.props.locations}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    onVisitLocation={(locationId) => {
                        if (!this.props.loggedIn) {
                            // only allowed, when not open or already closed by the user
                            if (this.props.conversionLocationVisitAllowed) {
                                this.props.conversionLocationVisitShow(locationId);
                            }
                            return;
                        }
                        this.props.onVisitLocation(locationId);
                    }}
                />

                <MainMenu
                    key='mainMenu'
                    followUser={this.props.followUser}
                    loggedIn={this.props.loggedIn}
                    onOpenLoginDialog={() => this.props.navigateTo(routes.user.login)}
                    onOpenProfileDialog={() => this.props.navigateTo(routes.profile)}
                    onOpenRegisterDialog={() => this.props.navigateTo(routes.user.register)}
                    onOpenResetPasswordDialog={() => this.props.navigateTo(routes.user.resetPassword)}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    requestLogout={this.props.requestLogout}
                />

                <ConversionLocationVisit />

                <Navigator />

            </div>
        );
    }
}

VisitingLandmarks.propTypes = {
    categories: PropTypes.object.isRequired,
    conversionLocationVisitAllowed: PropTypes.bool.isRequired,
    followUser: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    communication: PropTypes.object.isRequired,
    userEmailConfirmed: PropTypes.bool.isRequired,
    visitedLocations: PropTypes.object.isRequired,

    conversionLocationVisitShow: PropTypes.func.isRequired,
    onToggleFollowUser: PropTypes.func.isRequired,
    onVisitLocation: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    requestLogout: PropTypes.func.isRequired,
};

VisitingLandmarks.contextTypes = {
    router: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.session.user,
        userEmail: state.session.user && state.session.user.email,
        userEmailConfirmed: state.session.user && state.session.user.isConfirmed || false,
        followUser: state.control.followUser,
        categories: state.data.categories,
        locations: state.data.locations,
        // an object is easier to access and check
        visitedLocations: state.session.user && state.session.user.visited || {},
        communication: state.communication,
        conversionLocationVisitAllowed: !state.control.conversionLocationVisit,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        conversionLocationVisitShow: (locationId) => dispatch(conversionLocationVisitShow({locationId})),
        onToggleFollowUser: (newValue) => dispatch(followUserSet(newValue)),
        navigateTo: (url) => dispatch(navigateTo(url)),
        requestLogout: () => dispatch(logoutThunk()),
        onVisitLocation: (locationId) => dispatch(visitLocationThunk(locationId)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);
