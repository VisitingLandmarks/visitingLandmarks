import deepFreeze from 'deep-freeze';


import reducer from '../../../../../src/redux/reducer/control';
import initialState from '../../../../../src/redux/reducer/control/initialState';
import {
    // DIALOG_CLOSE,
    // dialogClose,
    // DIALOG_OPEN,
    // dialogOpen,
    FOLLOW_USER_SET,
    followUserSet,
} from '../../../../../src/redux/action/ui';


describe('control reducer', () => {

    // it(DIALOG_CLOSE, () => {
    //
    //     const oldState = deepFreeze({
    //         ...initialState,
    //         openDialog: 'TEST',
    //     });
    //
    //     const newState = deepFreeze({
    //         ...initialState,
    //         openDialog: false,
    //     });
    //
    //     assert.deepEqual(reducer(oldState, dialogClose()), newState);
    //
    // });
    //
    // it(DIALOG_OPEN, () => {
    //
    //     const oldState = deepFreeze({
    //         ...initialState,
    //     });
    //
    //     const dialogName = 'TEST';
    //     const newState = deepFreeze({
    //         ...initialState,
    //         openDialog: dialogName,
    //     });
    //
    //     assert.deepEqual(reducer(oldState, dialogOpen(dialogName)), newState);
    //
    // });

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

                assert.deepEqual(reducer(oldState, followUserSet(testing)), newState);

            });
        });

    });
});