import {connect} from 'react-redux';

import VisitingLandmarks from '../presentational/visitingLandmarks.jsx';


import {registerThunk} from '../action/thunk/register';
import {loginThunk} from '../action/thunk/login';
import {logoutThunk} from '../action/thunk/logout';

import dialogCloseAction from '../action/dialogClose';
import dialogOpenAction from '../action/dialogOpen';

const mapStateToProps = (state) => {
    return {
        loggedIn: !!state.user,
        userEmail: state.user && state.user.email,
        userEmailConfirmed: state.user && state.user.isConfirmed,
        locations: state.locations,
        openDialog: {
            login: state.openDialog === 'login',
            register: state.openDialog === 'register'
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestRegister: (username, password) => dispatch(registerThunk({username, password})),
        requestLogin: (username, password) => dispatch(loginThunk({username, password})),
        requestLogout: () => dispatch(logoutThunk()),

        onCloseDialog: () => dispatch(dialogCloseAction()),
        onOpenLoginDialog: () => dispatch(dialogOpenAction('login')),
        onOpenRegisterDialog: () => dispatch(dialogOpenAction('register'))
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisitingLandmarks);