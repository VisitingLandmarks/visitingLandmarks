import {connect} from 'react-redux';

import VisitingLandmarks from '../presentational/visitingLandmarks';

import {changePasswordThunk} from '../../redux/action/thunk/changePassword';
import {resetPasswordThunk} from '../../redux/action/thunk/resetPassword';
import {loginThunk} from '../../redux/action/thunk/login';
import {logoutThunk} from '../../redux/action/thunk/logout';
import {registerThunk} from '../../redux/action/thunk/register';

import {dialogClose, dialogOpen, followUserSet} from '../../redux/action/ui';

import {dialogName as resetPasswordDialogName} from '../presentational/dialog/resetPassword';
import {dialogName as loginDialogName} from '../presentational/dialog/login';
import {dialogName as registerDialogName} from '../presentational/dialog/register';
import {dialogName as profileDialogName} from '../presentational/dialog/profile';

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
            passwordReset: state.openDialog === resetPasswordDialogName,
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

        onToggleFollowUser: (newValue) =>dispatch(followUserSet(newValue)),

        onCloseDialog: () => dispatch(dialogClose()),
        onOpenLoginDialog: () => dispatch(dialogOpen(loginDialogName)),
        onOpenProfileDialog: () => dispatch(dialogOpen(profileDialogName)),
        onOpenRegisterDialog: () => dispatch(dialogOpen(registerDialogName)),
        onOpenResetPasswordDialog: () => dispatch(dialogOpen(resetPasswordDialogName))
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);