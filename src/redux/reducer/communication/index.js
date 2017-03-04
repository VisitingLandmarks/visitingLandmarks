//register
import {REGISTER, REGISTER_FAILURE, REGISTER_SUCCESS} from '../../action/thunk/register';

//login
import {LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS} from '../../action/thunk/login';

//logout
import {LOGOUT, LOGOUT_FAILURE, LOGOUT_SUCCESS} from '../../action/thunk/logout';

//change Password
import {PASSWORD_CHANGE, PASSWORD_CHANGE_FAILURE, PASSWORD_CHANGE_SUCCESS} from '../../action/thunk/changePassword';

import initialState from './initialState';

export const inProgress = 'inProgress';
export const failure = 'failure';
export const success = 'success';

export default (oldState = initialState, action) => {

    switch (action.type) {

        //register
        case REGISTER: {
            return {
                ...oldState,
                registering: inProgress,
            };
        }

        case REGISTER_FAILURE: {
            return {
                ...oldState,
                registering: failure,
            };
        }

        case REGISTER_SUCCESS: {
            return {
                ...oldState,
                registering: success,
            };
        }


        //login
        case LOGIN: {
            return {
                ...oldState,
                loggingIn: inProgress,
            };
        }
        case LOGIN_FAILURE: {
            return {
                ...oldState,
                loggingIn: failure,
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...oldState,
                loggingIn: success,
            };
        }


        //logout
        case LOGOUT: {
            return {
                ...oldState,
                loggingOut: inProgress,
            };
        }
        case LOGOUT_FAILURE: {
            return {
                ...oldState,
                loggingOut: failure,
            };
        }
        case LOGOUT_SUCCESS: {
            return {
                ...oldState,
                loggingOut: success,
            };
        }

        //changePassword
        case PASSWORD_CHANGE: {
            return {
                ...oldState,
                changingPassword: inProgress,
            };
        }
        case PASSWORD_CHANGE_FAILURE: {
            return {
                ...oldState,
                changingPassword: failure,
            };
        }
        case PASSWORD_CHANGE_SUCCESS: {
            return {
                ...oldState,
                changingPassword: success,
            };
        }


        default: {
            return oldState;
        }
    }

};