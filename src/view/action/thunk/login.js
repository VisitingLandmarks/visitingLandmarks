import axios from 'axios';

import requestLoginAction from '../request/login';
import requestLoginActionSuccess from '../request/loginSuccess';
import requestLoginActionFailure from '../request/loginFailure';

import dialogCloseAction from '../dialogClose';


export function loginThunk(loginData) {
    return function (dispatch) {
        dispatch(requestLoginAction());
        axios.post('/login', loginData)
            .then((response) => {
                dispatch(requestLoginActionSuccess(response.data.user));
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
            
            .catch((response) => dispatch(requestLoginActionFailure(response)));
    };
}