import deepFreeze from 'deep-freeze';

import reducer from '../../../../src/view/reducer/reducer';
import initialState from '../../../../src/view/reducer/initialState';

import loginAction, {type as loginType} from '../../../../src/view/action/request/login';
import loginSuccessAction, {type as loginSuccessType} from '../../../../src/view/action/request/loginSuccess';
import loginFailureAction, {type as loginFailureType} from '../../../../src/view/action/request/loginFailure';

import dialogCloseAction, {type as typeDialogClose} from '../../../../src/view/action/dialogClose';
import dialogOpenAction, {type as typeDialogOpen} from '../../../../src/view/action/dialogOpen';
import setFollowUserAction, {type as typeSetFollowUser} from '../../../../src/view/action/setFollowUser';
import visitedLocationAction, {type as typeVisitedLocation} from '../../../../src/view/action/visitedLocation';
import setLocationsAction, {type as typeSetLocations} from '../../../../src/view/action/setLocations';

describe('reducer', ()=> {
    describe('thunks', ()=> {
        describe('login', ()=> {
            describe('actions', ()=> {

                it(loginType, () => {

                    const userData = {
                        email: 'test@test.com'
                    };

                    const oldState = deepFreeze(initialState);
                    const newState = {
                        ...initialState,
                        actions: {
                            ...initialState.actions,
                            loggingIn: 'inProgress'
                        }
                    };

                    assert.deepEqual(reducer(oldState, loginAction(userData)), newState);

                });

                it(loginSuccessType, () => {

                    const userData = deepFreeze({
                        email: 'test@test.com'
                    });

                    const oldState = deepFreeze(initialState);
                    const newState = {
                        ...initialState,
                        actions: {
                            ...initialState.actions,
                            loggingIn: 'success'
                        },
                        user: userData
                    };

                    assert.deepEqual(reducer(oldState, loginSuccessAction(userData)), newState);

                });

                it(loginFailureType, () => {

                    const oldState = deepFreeze({});
                    const newState = {actions: {loggingIn: 'failure'}};

                    assert.deepEqual(reducer(oldState, loginFailureAction()), newState);

                });

            });
        });
    });

    it(typeDialogOpen, () => {

        const oldState = deepFreeze({
            ...initialState
        });

        const dialogName = 'TEST';
        const newState = deepFreeze({
            ...initialState,
            openDialog: dialogName
        });

        assert.deepEqual(reducer(oldState, dialogOpenAction(dialogName)), newState);

    });

    it(typeSetFollowUser, () => {

        const oldState = deepFreeze({
            ...initialState,
            followUser: false
        });

        const newState = deepFreeze({
            ...initialState,
            followUser: true
        });

        assert.deepEqual(reducer(oldState, setFollowUserAction(true)), newState);

    });

    it(typeSetLocations, () => {

        const oldState = deepFreeze({
            ...initialState
        });

        const locations = [];

        const newState = deepFreeze({
            ...initialState,
            locations
        });

        assert.deepEqual(reducer(oldState, setLocationsAction(locations)), newState);

    });

    it(typeVisitedLocation, () => {

        const dateA = new Date();
        const dateB = new Date();

        const oldState = deepFreeze({
            ...initialState,
            user: {
                visited: {
                    a: dateA
                }
            }
        });

        const newState = deepFreeze({
            ...initialState,
            user: {
                visited: {
                    a: dateA,
                    b: dateB
                }
            }
        });

        assert.deepEqual(reducer(oldState, visitedLocationAction({b: dateB})), newState);

    });
});