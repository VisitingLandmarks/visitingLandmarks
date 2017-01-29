import axios from 'axios';
import builder from '../builder';
import routes from '../../../../config/routes';
import {dialogClose} from '../ui';

export const REGISTER = 'REGISTER';
export const register = builder(REGISTER);

export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const registerFailure = builder(REGISTER_FAILURE);

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const registerSuccess = (user) => {
    return {
        type: REGISTER_SUCCESS,
        user
    };
};


export function registerThunk(registerData) {
    return function (dispatch) {
        dispatch(register());
        axios.post(routes.user.register, registerData)
            .then((response) => {
                dispatch(registerSuccess(response.data.user));
            })

            //delay the closing of the dialog to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                dispatch(dialogClose);
            })

            .catch((response) => dispatch(registerFailure(response)));
    };
}