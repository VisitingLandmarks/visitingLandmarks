import reducer from '../../../../src/view/reducer/reducer';
import initialState from '../../../../src/view/reducer/initialState';

import loginAction, {type as loginType} from '../../../../src/view/action/request/login';
import loginSuccessAction, {type as loginSuccessType} from '../../../../src/view/action/request/loginSuccess';
import loginFailureAction, {type as loginFailureType} from '../../../../src/view/action/request/loginFailure';

import visitedLocationsAction, {type as typeVisitedLocations} from '../../../../src/view/action/visitedLocations';
import deepFreeze from 'deep-freeze';

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

                it(typeVisitedLocations, () => {

                    const dateA = new Date();
                    const dateB = new Date();

                    const oldState = deepFreeze({
                        user: {
                            visited: {
                                a: dateA
                            }
                        }
                    });

                    const newState = deepFreeze({
                        user: {
                            visited: {
                                a: dateA,
                                b: dateB
                            }
                        }
                    });
                    assert.deepEqual(reducer(oldState, visitedLocationsAction({b: dateB})), newState);

                });
            });
        });
    });

});