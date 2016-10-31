import axios from 'axios';

import requestResetPasswordAction from '../request/resetPassword';
import requestResetPasswordActionSuccess from '../request/resetPasswordSuccess';
import requestResetPasswordActionFailure from '../request/resetPasswordFailure';

import dialogCloseAction from '../dialogClose';


export function resetPasswordThunk(username) {
    return function (dispatch) {
        dispatch(requestResetPasswordAction());
        axios.post('/resetPassword', {username})
            .then((response) => {
                dispatch(requestResetPasswordActionSuccess(response));
            })

            //delay the closing of the dialog to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                dispatch(dialogCloseAction());
            })

            .catch((response) => dispatch(requestResetPasswordActionFailure(response)));
    };
}