import {routes} from '../../../modules/routes';

import axios from 'axios';
import builder from '../builder';

export const loggingOut = 'loggingOut';

export const LOGOUT = 'LOGOUT';
export const logout = builder(LOGOUT);

export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const logoutFailure = builder(LOGOUT_FAILURE);

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const logoutSuccess = builder(LOGOUT_SUCCESS);

export const logoutThunk = () => {
    return function (dispatch) {
        dispatch(logout());
        axios.post(routes.user.logout)
            .then(() => dispatch(logoutSuccess()))
            .catch((response) => dispatch(logoutFailure({error: response && response.response && response.response.data})));
    };
};