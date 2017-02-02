import axios from 'axios';
import builder from '../builder';
import routes from '../../../../config/routes';

export const LOGOUT = 'LOGOUT';
export const logout = builder(LOGOUT);

export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const logoutFailure = builder(LOGOUT_FAILURE);

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const logoutSuccess = builder(LOGOUT_SUCCESS);

export const logoutThunk = ()=> {
    return function (dispatch) {
        dispatch(logout());
        axios.post(routes.user.logout)
            .then((response) => dispatch(logoutSuccess(response)))
            .catch((response) => dispatch(logoutFailure(response)));
    };
};