import axios from 'axios';

import requestRegisterAction from '../request/register';
import requestRegisterActionSuccess from '../request/registerSuccess';
import requestRegisterActionFailure from '../request/registerFailure';

import dialogCloseAction from '../dialogClose';


export function registerThunk(registerData) {
    return function (dispatch) {
        dispatch(requestRegisterAction());
        axios.post('/register', registerData)
            .then((response) => {
                dispatch(requestRegisterActionSuccess(response.data.user));
            })

            //delay the closing of the register to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                dispatch(dialogCloseAction());
            })
            
            .catch((response) => dispatch(requestRegisterActionFailure(response)));
    };
}