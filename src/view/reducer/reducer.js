import {type as typeLoggedIn} from '../action/loggedIn';
import {type as typeFailedLogin} from '../action/failedLogIn';
import {type as typeLoggedOut} from '../action/loggedOut';
import {type as typeSetLocations} from '../action/setLocations';

import initialState from './initialState';

export default (oldState = initialState, action) => {
    switch (action.type) {
        case typeLoggedIn:
            return Object.assign({}, oldState, {user: action.user});
        case typeFailedLogin:
            return Object.assign({}, oldState, {failedLogin: oldState.failedLogin + 1});
        case typeLoggedOut:
            return Object.assign({}, oldState, initialState);
        case typeSetLocations:
            return Object.assign({}, oldState, {locations: action.locations});
        default:
            return oldState;
    }

};