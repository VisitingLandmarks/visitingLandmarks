import {connect} from 'react-redux';

import VisitingLandmarks from '../presentational/visitingLandmarks.jsx';

import {changePasswordThunk} from '../action/thunk/changePassword';
import {resetPasswordThunk} from '../action/thunk/resetPassword';
import {loginThunk} from '../action/thunk/login';
import {logoutThunk} from '../action/thunk/logout';
import {registerThunk} from '../action/thunk/register';

import setFollowUserAction from '../action/setFollowUser';
import dialogCloseAction from '../action/dialogClose';
import dialogOpenAction from '../action/dialogOpen';

import {dialogName as resetPasswordDialogName} from '../presentational/dialog/resetPassword.jsx';
import {dialogName as loginDialogName} from '../presentational/dialog/login.jsx';
import {dialogName as registerDialogName} from '../presentational/dialog/register.jsx';
import {dialogName as profileDialogName} from '../presentational/dialog/profile.jsx';

const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.user,
        userEmail: state.user && state.user.email,
        userEmailConfirmed: state.user && state.user.isConfirmed,
        followUser: state.followUser,
        categories: state.categories,
        locations: state.locations,
        //an object is easier to access and check
        visitedLocations: state.user && state.user.visited || {},
        openDialog: {
            resetPassword: state.openDialog === resetPasswordDialogName,
            login: state.openDialog === loginDialogName,
            profile: state.openDialog === profileDialogName,
            register: state.openDialog === registerDialogName
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestChangePassword: (password) => dispatch(changePasswordThunk(password)),
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
        requestResetPassword: (username) => dispatch(resetPasswordThunk(username)),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
        requestLogout: () => dispatch(logoutThunk()),

        onToggleFollowUser: (newValue) =>dispatch(setFollowUserAction(newValue)),

        onCloseDialog: () => dispatch(dialogCloseAction()),
        onOpenLoginDialog: () => dispatch(dialogOpenAction(loginDialogName)),
        onOpenProfileDialog: () => dispatch(dialogOpenAction(profileDialogName)),
        onOpenRegisterDialog: () => dispatch(dialogOpenAction(registerDialogName)),
        onOpenResetPasswordDialog: () => dispatch(dialogOpenAction(resetPasswordDialogName))
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);