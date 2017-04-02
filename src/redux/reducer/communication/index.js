import {
    REGISTER,
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    registering,
} from '../../action/thunk/register';

import {
    LOGIN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    loggingIn,
} from '../../action/thunk/login';

import {
    LOGOUT,
    LOGOUT_FAILURE,
    LOGOUT_SUCCESS,
    loggingOut,
} from '../../action/thunk/logout';

import {
    PASSWORD_RESET,
    PASSWORD_RESET_FAILURE,
    PASSWORD_RESET_SUCCESS,
    resettingPassword,
} from '../../action/thunk/resetPassword';

import {
    PASSWORD_CHANGE,
    PASSWORD_CHANGE_FAILURE,
    PASSWORD_CHANGE_SUCCESS,
    changingPassword,
} from '../../action/thunk/changePassword';

import initialState from './initialState';

export const inProgress = 'inProgress';
export const failure = 'failure';
export const success = 'success';

export default (oldState = initialState, action) => {

    switch (action.type) {

        case REGISTER: {
            return {
                ...oldState,
                [registering]: {[inProgress]: true},
            };
        }

        case REGISTER_FAILURE: {
            return {
                ...oldState,
                [registering]: {[failure]: action.error || true},
            };
        }

        case REGISTER_SUCCESS: {
            return {
                ...oldState,
                [registering]: {[success]: true},
            };
        }


        case LOGIN: {
            return {
                ...oldState,
                [loggingIn]: {[inProgress]: true},
            };
        }
        case LOGIN_FAILURE: {
            return {
                ...oldState,
                [loggingIn]: {[failure]: action.error || true},
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...oldState,
                [loggingIn]: {[success]: true},
            };
        }


        case LOGOUT: {
            return {
                ...oldState,
                [loggingOut]: {[inProgress]: true},
            };
        }
        case LOGOUT_FAILURE: {
            return {
                ...oldState,
                [loggingOut]: {[failure]: action.error || true},
            };
        }
        case LOGOUT_SUCCESS: {
            return {
                ...oldState,
                [loggingOut]: {[success]: true},
            };
        }


        case PASSWORD_RESET: {
            return {
                ...oldState,
                [resettingPassword]: {[inProgress]: true},
            };
        }
        case PASSWORD_RESET_FAILURE: {
            return {
                ...oldState,
                [resettingPassword]: {[failure]: action.error || true},
            };
        }
        case PASSWORD_RESET_SUCCESS: {
            return {
                ...oldState,
                [resettingPassword]: {[success]: true},
            };
        }




        case PASSWORD_CHANGE: {
            return {
                ...oldState,
                [changingPassword]: {[inProgress]: true},
            };
        }
        case PASSWORD_CHANGE_FAILURE: {
            return {
                ...oldState,
                [changingPassword]: {[failure]: action.error || true},
            };
        }
        case PASSWORD_CHANGE_SUCCESS: {
            return {
                ...oldState,
                [changingPassword]: {[success]: true},
            };
        }


        default: {
            return oldState;
        }
    }

};