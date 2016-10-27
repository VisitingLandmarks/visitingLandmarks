//user management
//login
import {type as registerType} from '../action/request/register';
import {type as registerSuccessType} from '../action/request/registerSuccess';
import {type as registerFailureType} from '../action/request/registerFailure';

//login
import {type as loginType} from '../action/request/login';
import {type as loginSuccessType} from '../action/request/loginSuccess';
import {type as loginFailureType} from '../action/request/loginFailure';

//logout
import {type as logoutType} from '../action/request/logout';
import {type as logoutSuccessType} from '../action/request/logoutSuccess';
import {type as logoutFailureType} from '../action/request/logoutFailure';

//change Password
import {type as changePasswordType} from '../action/request/changePassword';
import {type as changePasswordSuccessType} from '../action/request/changePasswordSuccess';
import {type as changePasswordFailureType} from '../action/request/changePasswordFailure';

//UI management
import {type as setFollowUserType} from '../action/setFollowUser';

import {type as dialogCloseType} from '../action/dialogClose';
import {type as dialogOpenType} from '../action/dialogOpen';

//locations
import {type as setLocationsType} from '../action/setLocations';
import {type as visitedLocationsType} from '../action/visitedLocations';

import initialState from './initialState';

export default (oldState = initialState, action) => {

    switch (action.type) {
        //user management

        //login
        case registerType:
        {
            // return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {registering: 'inProgress'})});
            return {...oldState, actions: {...oldState.actions, registering: 'inProgress'}};
        }
        case registerSuccessType:
        {
            return Object.assign({}, oldState, {
                user: action.user,
                actions: Object.assign({}, oldState.actions, {registering: 'success'})
            });
        }
        case registerFailureType:
        {
            return Object.assign({}, oldState, {
                actions: Object.assign({}, oldState.actions, {registering: 'failure'})
            });
        }

        //login
        case loginType:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {loggingIn: 'inProgress'})});
        }
        case loginSuccessType:
        {
            return Object.assign({}, oldState, {
                user: action.user,
                actions: Object.assign({}, oldState.actions, {loggingIn: 'success'})
            });
        }
        case loginFailureType:
        {
            return Object.assign({}, oldState, {
                actions: Object.assign({}, oldState.actions, {loggingIn: 'failure'})
            });
        }

        //logout
        case logoutType:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {loggingOut: 'inProgress'})});
        }
        case logoutSuccessType:
        {
            return Object.assign({}, oldState, initialState); //@todo: bad idea -> removes all locations -> sugar the initial state with the correct locations
        }
        case logoutFailureType:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {loggingOut: 'failure'})});
        }

        //changePassword
        case changePasswordType:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {changingPassword: 'inProgress'})});
        }
        case changePasswordSuccessType:
        {
            return Object.assign({}, oldState, {
                actions: Object.assign({}, oldState.actions, {changingPassword: 'success'})
            });
        }
        case changePasswordFailureType:
        {
            return Object.assign({}, oldState, {actions: Object.assign({}, oldState.actions, {changingPassword: 'failure'})});
        }


        //UI management
        case setFollowUserType:
        {
            return Object.assign({}, oldState, {followUser: action.value});
        }
        case dialogCloseType:
        {
            return Object.assign({}, oldState, {openDialog: false});
        }
        case dialogOpenType:
        {
            return Object.assign({}, oldState, {openDialog: action.dialog});
        }

        //locations
        case setLocationsType:
        {
            return Object.assign({}, oldState, {locations: action.locations});
        }
        case visitedLocationsType:
        {
            return Object.assign(
                {},
                oldState,
                {
                    user: Object.assign(
                        {},
                        oldState.user,
                        {
                            visited: Object.assign({}, oldState.user.visited, action.visitedLocation)
                        }
                    )
                }
            );
        }


        default:
        {
            return oldState;
        }
    }

};