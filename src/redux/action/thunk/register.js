import {routes} from '../../../modules/routes';

import axios from 'axios';
import builder from '../builder';
import {navigateTo} from '../../action/ui';

export const registering = 'registering';

export const REGISTER = 'REGISTER';
export const register = builder(REGISTER);

export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const registerFailure = builder(REGISTER_FAILURE);

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const registerSuccess = builder(REGISTER_SUCCESS);


export function registerThunk(registerData) {
    return function (dispatch) {
        dispatch(register());
        axios.post(routes.user.register, registerData)
            .then((response) => {
                dispatch(registerSuccess({user : response.data.user}));
            })

            //delay the closing of the dialog to display some positive feedback to the user
            .then(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
            })

            .then(() => {
                dispatch(navigateTo(routes.root));
            })

            .catch((response) => dispatch(registerFailure({error: response && response.response && response.response.data})));
    };
}