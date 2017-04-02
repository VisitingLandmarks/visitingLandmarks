import React, {PropTypes} from 'react';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMap from './mainMap';
import MainMenu from './mainMenu';
import Navigator from './navigator';

import {onVisitLocation} from '../client/toServer';
import {connect} from 'react-redux';

import {logoutThunk} from '../redux/action/thunk/logout';

import {followUserSet, navigateTo} from '../redux/action/ui';

import routes from '../../config/routes';

/**
 * the whole frontend
 */
class VisitingLandmarks extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="mainContainer">

                <MainMap
                    followUser={this.props.followUser}
                    visitedLocations={this.props.visitedLocations}
                    locations={this.props.locations}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    onVisitLocation={onVisitLocation}
                />

                <MainMenu
                    followUser={this.props.followUser}
                    loggedIn={this.props.loggedIn}
                    onOpenLoginDialog={() => this.props.navigateTo(routes.user.login)}
                    onOpenProfileDialog={() => this.props.navigateTo(routes.profile)}
                    onOpenRegisterDialog={() => this.props.navigateTo(routes.user.register)}
                    onOpenResetPasswordDialog={() => this.props.navigateTo(routes.user.resetPassword)}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    requestLogout={this.props.requestLogout}
                />

                <Navigator/>

            </div>
        );

    }
}

VisitingLandmarks.propTypes = {
    categories: PropTypes.object.isRequired,
    followUser: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    communication: PropTypes.object.isRequired,
    userEmailConfirmed: PropTypes.bool.isRequired,
    visitedLocations: PropTypes.object.isRequired,

    requestLogout: PropTypes.func.isRequired,

    onToggleFollowUser: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
};

VisitingLandmarks.contextTypes = {
    router: React.PropTypes.object,
};


const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.session.user,
        userEmail: state.session.user && state.session.user.email,
        userEmailConfirmed: state.session.user && state.session.user.isConfirmed || false,
        followUser: state.control.followUser,
        categories: state.data.categories,
        locations: state.data.locations,
        //an object is easier to access and check
        visitedLocations: state.session.user && state.session.user.visited || {},
        communication: state.communication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // requestChangePassword: (password) => dispatch(changePasswordThunk(password)),
        // requestResetPassword: (username) => dispatch(resetPasswordThunk(username)),
        requestLogout: () => dispatch(logoutThunk()),

        onToggleFollowUser: (newValue) => dispatch(followUserSet(newValue)),
        navigateTo: (url) => dispatch(navigateTo(url)),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);