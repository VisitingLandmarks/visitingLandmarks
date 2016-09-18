
import reducer from '../../../../src/view/reducer/reducer.js';
import loggedInAction, {type as typeLoggedIn} from '../../../../src/view/action/loggedIn';
import failedLoginAction, {type as typeFailedLogin} from '../../../../src/view/action/failedLogIn';
import deepFreeze from 'deep-freeze';

describe('reducer', ()=> {
    it(typeLoggedIn, () => {

        const userData = {
            email: 'test@test.com'
        };

        const oldState = deepFreeze({});
        const newState = {
          user : Object.assign({}, userData)
        };

        assert.deepEqual(reducer(oldState, loggedInAction(userData)), newState);

    });

    it(typeFailedLogin, () => {

        const oldState = deepFreeze({failedLogin : 1});
        const newState = {
          failedLogin : 2
        };

        assert.deepEqual(reducer(oldState, failedLoginAction()), newState);

    });

});