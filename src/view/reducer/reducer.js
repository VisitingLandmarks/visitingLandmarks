//user management
//login
import {type as typeRegister} from '../action/request/register';
import {type as typeRegisterSuccess} from '../action/request/registerSuccess';
import {type as typeRegisterFailure} from '../action/request/registerFailure';

//login
import {type as typeLogin} from '../action/request/login';
import {type as typeLoginSuccess} from '../action/request/loginSuccess';
import {type as typeLoginFailure} from '../action/request/loginFailure';

//logout
import {type as typeLogout} from '../action/request/logout';
import {type as typeLogoutSuccess} from '../action/request/logoutSuccess';
import {type as typeLogoutFailure} from '../action/request/logoutFailure';

//UI management
import {type as typeDialogClose} from '../action/dialogClose';
import {type as typeDialogOpenLogin} from '../action/dialogOpen';

//locations
import {type as typeSetLocations} from '../action/setLocations';
import {type as typeVisitedLocations} from '../action/visitedLocations';

import initialState from './initialState';

export default (oldState = initialState, action) => {

    switch (action.type) {
        //user management

        //login
        case typeRegister:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {registering: 'inProgress'})});
        }
        case typeRegisterSuccess:
        {
            return Object.assign({}, oldState, {
                user: action.user,
                actions: Object.assign({}, oldState.actions, {registering: 'success'})
            });
        }
        case typeRegisterFailure:
        {
            return Object.assign({}, oldState, {
                actions: Object.assign({}, oldState.actions, {registering: 'failure'})
            });
        }
            
        //login
        case typeLogin:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {logginIn: 'inProgress'})});
        }
        case typeLoginSuccess:
        {
            return Object.assign({}, oldState, {
                user: action.user,
                actions: Object.assign({}, oldState.actions, {logginIn: 'success'})
            });
        }
        case typeLoginFailure:
        {
            return Object.assign({}, oldState, {
                actions: Object.assign({}, oldState.actions, {logginIn: 'failure'})
            });
        }
            
        //logout
        case typeLogout:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {loggingOut: 'inProgress'})});
        }
        case typeLogoutSuccess:
        {
            return Object.assign({}, oldState, initialState); //@todo: bad idea -> removes all locations -> sugar the initial state with the correct locations
        }
        case typeLogoutFailure:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {loggingOut: 'failure'})});
        }


        //UI management
        case typeDialogClose:
        {
            return Object.assign({}, oldState, {openDialog: false});
        }
        case typeDialogOpenLogin:
        {
            return Object.assign({}, oldState, {openDialog: action.dialog});
        }

        //locations
        case typeSetLocations:
        {
            return Object.assign({}, oldState, {locations: action.locations});
        }
        case typeVisitedLocations:
        {
            return Object.assign({}, oldState, {user: Object.assign({}, oldState.user, {visited : oldState.user.visited.concat(action.locationIds)})});
        }


        default:
        {
            return oldState;
        }
    }

};