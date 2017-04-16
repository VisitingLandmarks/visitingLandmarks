import {routes} from '../../../modules/routes';

import axios from 'axios';
import builder from '../builder';

export const changingPassword = 'changingPassword';

export const PASSWORD_CHANGE = 'PASSWORD_CHANGE';
export const passwordChange = builder(PASSWORD_CHANGE);

export const PASSWORD_CHANGE_FAILURE = 'PASSWORD_CHANGE_FAILURE';
export const passwordChangeFailure = builder(PASSWORD_CHANGE_FAILURE);

export const PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS';
export const passwordChangeSuccess = builder(PASSWORD_CHANGE_SUCCESS);

import {navigateTo} from '../../action/ui';

export function changePasswordThunk(data) {
    return function (dispatch) {
        dispatch(passwordChange());
        axios.post(routes.user.passwordChange, data)
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
                dispatch(navigateTo(routes.root));
            })

            .catch((response) => dispatch(passwordChangeFailure(response)));
    };
}