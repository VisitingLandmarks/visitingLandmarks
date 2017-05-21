import deepFreeze from 'deep-freeze';
import expect from 'unexpected';

import reducer, {inProgress, failure, success} from '../../../../../src/redux/reducer/communication';
import initialState from '../../../../../src/redux/reducer/communication/initialState';

// register
import {
    REGISTER,
    register,
    REGISTER_FAILURE,
    registerFailure,
    REGISTER_SUCCESS,
    registerSuccess,
    registering,
} from '../../../../../src/redux/action/thunk/register';

// login
import {
    LOGIN,
    login,
    LOGIN_FAILURE,
    loginFailure,
    LOGIN_SUCCESS,
    loginSuccess,
    loggingIn,
} from '../../../../../src/redux/action/thunk/login';

// logout
import {
    LOGOUT,
    logout,
    LOGOUT_FAILURE,
    logoutFailure,
    LOGOUT_SUCCESS,
    logoutSuccess,
    loggingOut,
} from '../../../../../src/redux/action/thunk/logout';

// change Password
import {
    PASSWORD_CHANGE,
    passwordChange,
    PASSWORD_CHANGE_FAILURE,
    passwordChangeFailure,
    PASSWORD_CHANGE_SUCCESS,
    passwordChangeSuccess,
    changingPassword,
} from '../../../../../src/redux/action/thunk/changePassword';

describe('communication reducer', () => {
    const buildSimpleTest = (thunkPart, action, expectedState, verb) => {
        it(thunkPart, () => {
            const oldState = deepFreeze({
                ...initialState,
            });

            const newState = deepFreeze({
                ...initialState,
                [verb]: {[expectedState]: true},
            });

            expect(reducer(oldState, action()), 'to equal', newState);
        });
    };

    describe('REGISTER Thunk', () => {
        buildSimpleTest(REGISTER, register, inProgress, registering);
        buildSimpleTest(REGISTER_FAILURE, registerFailure, failure, registering);
        buildSimpleTest(REGISTER_SUCCESS, registerSuccess, success, registering);
    });

    describe('LOGIN Thunk', () => {
        buildSimpleTest(LOGIN, login, inProgress, loggingIn);
        buildSimpleTest(LOGIN_FAILURE, loginFailure, failure, loggingIn);
        buildSimpleTest(LOGIN_SUCCESS, loginSuccess, success, loggingIn);
    });

    describe('LOGOUT Thunk', () => {
        buildSimpleTest(LOGOUT, logout, inProgress, loggingOut);
        buildSimpleTest(LOGOUT_FAILURE, logoutFailure, failure, loggingOut);
        buildSimpleTest(LOGOUT_SUCCESS, logoutSuccess, success, loggingOut);
    });

    describe('PASSWORD_CHANGE Thunk', () => {
        buildSimpleTest(PASSWORD_CHANGE, passwordChange, inProgress, changingPassword);
        buildSimpleTest(PASSWORD_CHANGE_FAILURE, passwordChangeFailure, failure, changingPassword);
        buildSimpleTest(PASSWORD_CHANGE_SUCCESS, passwordChangeSuccess, success, changingPassword);
    });
});
