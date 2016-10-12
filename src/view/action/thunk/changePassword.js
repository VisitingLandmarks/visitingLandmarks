import axios from 'axios';

import requestChangePasswordAction from '../request/changePassword';
import requestChangePasswordActionSuccess from '../request/changePasswordSuccess';
import requestChangePasswordActionFailure from '../request/changePasswordFailure';

import dialogCloseAction from '../dialogClose';


export function changePasswordThunk(newPassword) {
    return function (dispatch) {
        dispatch(requestChangePasswordAction());
        axios.post('/changePassword', {password: newPassword})
            .then((response) => {
                dispatch(requestChangePasswordActionSuccess())
            })

            //delay the closing of the login to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 500)
                });
            })

            .then(() => {
                dispatch(dialogCloseAction());
            })

            .catch((response) => dispatch(requestChangePasswordActionFailure()))
    }
}