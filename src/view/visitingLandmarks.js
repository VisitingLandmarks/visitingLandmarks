import React, {PropTypes} from 'react';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MainMap from './mainMap';
import MainMenu from './mainMenu';

import DialogResetPassword from './dialog/resetPassword';
import DialogLogin from './dialog/login';
import DialogProfile from './dialog/profile';
import DialogRegister from './dialog/register';

import {onVisitLocation} from '../client/toServer';
import {connect} from 'react-redux';

import {changePasswordThunk} from '../redux/action/thunk/changePassword';
import {resetPasswordThunk} from '../redux/action/thunk/resetPassword';
import {loginThunk} from '../redux/action/thunk/login';
import {logoutThunk} from '../redux/action/thunk/logout';
import {registerThunk} from '../redux/action/thunk/register';

import {dialogClose, dialogOpen, followUserSet} from '../redux/action/ui';

import {dialogName as resetPasswordDialogName} from './dialog/resetPassword';
import {dialogName as loginDialogName} from './dialog/login';
import {dialogName as registerDialogName} from './dialog/register';
import {dialogName as profileDialogName} from './dialog/profile';

import {loggingIn} from '../redux/action/thunk/login';
import {registering} from '../redux/action/thunk/register';
import {failure, inProgress} from '../redux/reducer/communication';


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
                    onOpenLoginDialog={this.props.onOpenLoginDialog}
                    onOpenProfileDialog={this.props.onOpenProfileDialog}
                    onOpenRegisterDialog={this.props.onOpenRegisterDialog}
                    onOpenResetPasswordDialog={this.props.onOpenResetPasswordDialog}
                    onToggleFollowUser={this.props.onToggleFollowUser}
                    requestLogout={this.props.requestLogout}
                />

                <DialogLogin
                    open={this.props.openDialog.login}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestLogin}
                    disabled={this.props.communication[loggingIn][inProgress]}
                    error={this.props.communication[loggingIn][failure]}
                />
                <DialogProfile
                    open={this.props.openDialog.profile}
                    onCloseDialog={this.props.onCloseDialog}
                    categories={this.props.categories}
                    locations={this.props.locations}
                    visitedLocations={this.props.visitedLocations}
                    userEmailConfirmed={this.props.userEmailConfirmed}
                />
                <DialogRegister
                    open={this.props.openDialog.register}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestRegister}
                    disabled={this.props.communication[registering][inProgress]}
                    error={this.props.communication[registering][failure]}
                />
                <DialogResetPassword
                    open={this.props.openDialog.passwordReset}
                    onCloseDialog={this.props.onCloseDialog}
                    onSubmit={this.props.requestResetPassword}
                />
            </div>
        );

    }
}

VisitingLandmarks.propTypes = {
    categories: PropTypes.object.isRequired,
    followUser: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    onCloseDialog: PropTypes.func.isRequired,
    onOpenLoginDialog: PropTypes.func.isRequired,
    onOpenProfileDialog: PropTypes.func.isRequired,
    onOpenRegisterDialog: PropTypes.func.isRequired,
    onOpenResetPasswordDialog: PropTypes.func.isRequired,
    onToggleFollowUser: PropTypes.func.isRequired,
    openDialog: PropTypes.object.isRequired,
    communication: PropTypes.object.isRequired,
    requestLogin: PropTypes.func.isRequired,
    requestLogout: PropTypes.func.isRequired,
    requestRegister: PropTypes.func.isRequired,
    requestResetPassword: PropTypes.func.isRequired,
    userEmailConfirmed: PropTypes.bool.isRequired,
    visitedLocations: PropTypes.object.isRequired,
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
        openDialog: {
            passwordReset: state.control.openDialog === resetPasswordDialogName,
            login: state.control.openDialog === loginDialogName,
            profile: state.control.openDialog === profileDialogName,
            register: state.control.openDialog === registerDialogName,
        },
        communication: state.communication,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestChangePassword: (password) => dispatch(changePasswordThunk(password)),
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
        requestResetPassword: (username) => dispatch(resetPasswordThunk(username)),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
        requestLogout: () => dispatch(logoutThunk()),

        onToggleFollowUser: (newValue) => dispatch(followUserSet(newValue)),

        onCloseDialog: () => dispatch(dialogClose()),
        onOpenLoginDialog: () => dispatch(dialogOpen(loginDialogName)),
        onOpenProfileDialog: () => dispatch(dialogOpen(profileDialogName)),
        onOpenRegisterDialog: () => dispatch(dialogOpen(registerDialogName)),
        onOpenResetPasswordDialog: () => dispatch(dialogOpen(resetPasswordDialogName)),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);