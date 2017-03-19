import axios from 'axios';
import routes from '../../../../config/routes';
import builder from '../builder';
import {dialogClose} from '../ui';

export const changingPassword = 'changingPassword';

export const PASSWORD_CHANGE = 'PASSWORD_CHANGE';
export const passwordChange = builder(PASSWORD_CHANGE);

export const PASSWORD_CHANGE_FAILURE = 'PASSWORD_CHANGE_FAILURE';
export const passwordChangeFailure = builder(PASSWORD_CHANGE_FAILURE);

export const PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS';
export const passwordChangeSuccess = builder(PASSWORD_CHANGE_SUCCESS);


export function changePasswordThunk(newPassword) {
    return function (dispatch) {
        dispatch(passwordChange());
        axios.post(routes.user.passwordChange, {password: newPassword})
            .then((response) => {
                dispatch(passwordChangeSuccess(response));
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

            .catch((response) => dispatch(passwordChangeFailure(response)));
    };
}