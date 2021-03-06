import {routes} from '../../../modules/routes';

import axios from 'axios';
import builder from '../builder';

export const resettingPassword = 'resettingPassword';

export const PASSWORD_RESET = 'PASSWORD_RESET';
export const passwordReset = builder(PASSWORD_RESET);

export const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE';
export const passwordResetFailure = builder(PASSWORD_RESET_FAILURE);

export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const passwordResetSuccess = builder(PASSWORD_RESET_SUCCESS);

export function resetPasswordThunk (data) {
    return function (dispatch) {
        dispatch(passwordReset());
        axios.post(routes.user.passwordResetRequest, data)
            .then((response) => {
                dispatch(passwordResetSuccess(response));
            })

            // delay the closing of the dialog to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                // @todo: dialog->check your emails
            })

            .catch((response) => dispatch(passwordResetFailure(response)));
    };
}
