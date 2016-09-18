import {type as typeLoggedIn} from '../action/loggedIn';
import {type as typeFailedLogin} from '../action/failedLogIn';
import {type as typeLoggedOut} from '../action/loggedOut';
import {type as typeAddChallenge} from '../action/addChallenge';

import initialState from './initialState';

export default (oldState = initialState, action) => {
    switch (action.type) {
        case typeLoggedIn:
            return Object.assign({}, oldState, {user: action.user});
        case typeFailedLogin:
            return Object.assign({}, oldState, {failedLogin: oldState.failedLogin + 1});
        case typeLoggedOut:
            return Object.assign({}, oldState, initialState);
        case typeAddChallenge:
            //@todo use challenge id to ensure that each challenge is unique
            return Object.assign({}, oldState, {challenges: oldState.challenges.concat(action.challenges)});
        default:
            return oldState;
    }

};