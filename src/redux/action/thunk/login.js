import axios from 'axios';
import builder from '../builder';
import routes from '../../../../config/routes';
import {dialogClose} from '../ui';

export const loggingIn = 'loggingIn';

export const LOGIN = 'LOGIN';
export const login = builder(LOGIN);

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const loginFailure = builder(LOGIN_FAILURE);

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = builder(LOGIN_SUCCESS);


export function loginThunk(loginData) {
    return function (dispatch) {
        dispatch(login());
        axios.post(routes.user.login, loginData)
            .then((response) => {
                dispatch(loginSuccess({user: response.data.user}));
            })

            //delay the closing of the dialog to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                dispatch(dialogClose());
            })

            .catch((response) => {
                dispatch(loginFailure({error: response && response.response && response.response.data}));
            });
    };
}