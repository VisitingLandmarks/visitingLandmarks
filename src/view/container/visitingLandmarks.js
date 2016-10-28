import {connect} from 'react-redux';

import VisitingLandmarks from '../presentational/visitingLandmarks.jsx';

import {registerThunk} from '../action/thunk/register';
import {loginThunk} from '../action/thunk/login';
import {logoutThunk} from '../action/thunk/logout';
import {changePasswordThunk} from '../action/thunk/changePassword';

import setFollowUserAction from '../action/setFollowUser';
import dialogCloseAction from '../action/dialogClose';
import dialogOpenAction from '../action/dialogOpen';

import {dialogName as changePasswordDialogName} from '../presentational/dialog/changePassword.jsx';
import {dialogName as loginDialogName} from '../presentational/dialog/login.jsx';
import {dialogName as registerDialogName} from '../presentational/dialog/register.jsx';
import {dialogName as profileDialogName} from '../presentational/dialog/profile.jsx';

const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.user,
        userEmail: state.user && state.user.email,
        userEmailConfirmed: state.user && state.user.isConfirmed,
        followUser: state.followUser,
        locations: state.locations,
        //an object is easier to access and check
        //@todo: is this a good case for a virtual property in the mongodb model?
        //@todo: or maybe storying it as object anyway? with some tracking data as property like timestamp?
        visitedLocations: state.user && state.user.visited || {},
        openDialog: {
            login: state.openDialog === loginDialogName,
            profile: state.openDialog === profileDialogName,
            register: state.openDialog === registerDialogName,
            changePassword: state.openDialog === changePasswordDialogName //@todo: build dialog action to display
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
        requestLogout: () => dispatch(logoutThunk()),
        requestChangePassword: (password) => dispatch(changePasswordThunk(password)),

        onToggleFollowUser: (newValue) =>dispatch(setFollowUserAction(newValue)),

        onCloseDialog: () => dispatch(dialogCloseAction()),
        onOpenLoginDialog: () => dispatch(dialogOpenAction(loginDialogName)),
        onOpenProfileDialog: () => dispatch(dialogOpenAction(profileDialogName)),
        onOpenRegisterDialog: () => dispatch(dialogOpenAction(registerDialogName))
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);