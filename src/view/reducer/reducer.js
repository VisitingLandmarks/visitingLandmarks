import {type as typeLoggedIn} from '../action/loggedIn';
import {type as typeFailedLogin} from '../action/failedLogIn';
import {type as typeLoggedOut} from '../action/loggedOut';
import {type as typeSetLocations} from '../action/setLocations';
import {type as typeVisitedLocations} from '../action/visitedLocations';

import initialState from './initialState';

export default (oldState = initialState, action) => {
    switch (action.type) {
        case typeLoggedIn:
        {
            return Object.assign({}, oldState, {user: action.user});
        }
        case typeFailedLogin:
        {
            return Object.assign({}, oldState, {failedLogin: oldState.failedLogin + 1});
        }
        case typeLoggedOut:
        {
            return Object.assign({}, oldState, initialState);
        }
        case typeSetLocations:
        {
            return Object.assign({}, oldState, {locations: action.locations});
        }
        case typeVisitedLocations:
        {
            const changedLocations = action.locationIds.reduce((changedLocations, locationId) => {

                //ignore the change if the location is not in the oldstate
                if (oldState.locations[locationId]) {
                    //get old location state and build new object with changed value
                    changedLocations[locationId] = Object.assign({}, oldState.locations[locationId], {visited: true});
                }
                return changedLocations;
            }, {});

            return Object.assign({}, oldState, {locations: Object.assign({}, oldState.locations, changedLocations)});

        }
        default:
        {
            return oldState;
        }
    }

}
;