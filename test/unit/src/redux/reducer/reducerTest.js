import deepFreeze from 'deep-freeze';

import reducer from '../../../../../src/redux/reducer';
import initialState from '../../../../../src/redux/reducer/initialState';

import {LOGIN, login, LOGIN_FAILURE, loginFailure, LOGIN_SUCCESS, loginSuccess} from '../../../../../src/redux/action/thunk/login';

import {DIALOG_CLOSE, dialogClose, DIALOG_OPEN, dialogOpen, FOLLOW_USER_SET, followUserSet} from '../../../../../src/redux/action/ui';
import {CATEGORIES_SET, categoriesSet} from '../../../../../src/redux/action/categories';
import {LOCATIONS_SET, locationsSet, LOCATIONS_VISIT, locationsVisit} from '../../../../../src/redux/action/locations';


describe('reducer', ()=> {
    describe('thunks', ()=> {
        describe(LOGIN, ()=> {
            it(LOGIN, () => {

                const userData = {
                    email: 'test@test.com',
                };

                const oldState = deepFreeze(initialState);
                const newState = {
                    ...initialState,
                    actions: {
                        ...initialState.actions,
                        loggingIn: 'inProgress',
                    },
                };

                assert.deepEqual(reducer(oldState, login(userData)), newState);

            });

            it(LOGIN_SUCCESS, () => {

                const userData = deepFreeze({
                    email: 'test@test.com',
                });

                const oldState = deepFreeze(initialState);
                const newState = {
                    ...initialState,
                    actions: {
                        ...initialState.actions,
                        loggingIn: 'success',
                    },
                    user: userData,
                };

                assert.deepEqual(reducer(oldState, loginSuccess(userData)), newState);

            });

            it(LOGIN_FAILURE, () => {

                const oldState = deepFreeze({});
                const newState = {actions: {loggingIn: 'failure'}};

                assert.deepEqual(reducer(oldState, loginFailure()), newState);

            });

        });
    });

    it(DIALOG_CLOSE, () => {

        const oldState = deepFreeze({
            ...initialState,
            openDialog: 'TEST',
        });

        const newState = deepFreeze({
            ...initialState,
            openDialog: false,
        });

        assert.deepEqual(reducer(oldState, dialogClose()), newState);

    });

    it(DIALOG_OPEN, () => {

        const oldState = deepFreeze({
            ...initialState,
        });

        const dialogName = 'TEST';
        const newState = deepFreeze({
            ...initialState,
            openDialog: dialogName,
        });

        assert.deepEqual(reducer(oldState, dialogOpen(dialogName)), newState);

    });

    it(FOLLOW_USER_SET, () => {

        const oldState = deepFreeze({
            ...initialState,
            followUser: false,
        });

        const newState = deepFreeze({
            ...initialState,
            followUser: true,
        });

        assert.deepEqual(reducer(oldState, followUserSet(true)), newState);

    });

    it(CATEGORIES_SET, () => {

        const oldState = deepFreeze({
            ...initialState,
        });

        const categories = {a: 'a'};

        const newState = deepFreeze({
            ...initialState,
            categories,
        });

        assert.deepEqual(reducer(oldState, categoriesSet(categories)), newState);

    });

    it(LOCATIONS_SET, () => {

        const oldState = deepFreeze({
            ...initialState,
        });

        const locations = {a: 'a'};

        const newState = deepFreeze({
            ...initialState,
            locations,
        });

        assert.deepEqual(reducer(oldState, locationsSet(locations)), newState);

    });

    it(LOCATIONS_VISIT, () => {

        const dateA = new Date();
        const dateB = new Date();

        const oldState = deepFreeze({
            ...initialState,
            user: {
                visited: {
                    a: dateA,
                },
            },
        });

        const newState = deepFreeze({
            ...initialState,
            user: {
                visited: {
                    a: dateA,
                    b: dateB,
                },
            },
        });

        assert.deepEqual(reducer(oldState, locationsVisit({b: dateB})), newState);

    });
});