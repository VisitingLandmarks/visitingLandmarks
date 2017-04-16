import deepFreeze from 'deep-freeze';
import expect from 'unexpected';

import reducer from '../../../../../src/redux/reducer/control';
import initialState from '../../../../../src/redux/reducer/control/initialState';
import {
    FOLLOW_USER_SET,
    followUserSet,
} from '../../../../../src/redux/action/ui';


describe('control reducer', () => {

    describe(FOLLOW_USER_SET, () => {
        [true, false].map((testing) => {

            it(testing.toString(), () => {

                const oldState = deepFreeze({
                    ...initialState,
                    followUser: !testing,
                });

                const newState = deepFreeze({
                    ...initialState,
                    followUser: testing,
                });

                expect(reducer(oldState, followUserSet(testing)), 'to equal', newState);
            });
        });

    });
});