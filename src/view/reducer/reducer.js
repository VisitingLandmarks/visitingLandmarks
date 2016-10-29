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
import {type as setCategoriesType} from '../action/setCategories';
import {type as setLocationsType} from '../action/setLocations';
import {type as visitedLocationsType} from '../action/visitedLocation';

import initialState from './initialState';

export default (oldState = initialState, action) => {

    switch (action.type) {
        //user management

        //register
        case registerType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    registering: 'inProgress'
                }
            };
        }
        case registerSuccessType:
        {
            return {
                ...oldState,
                user: action.user,
                actions: {
                    ...oldState.actions,
                    registering: 'success'
                }
            };
        }
        case registerFailureType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    registering: 'failure'
                }
            };
        }

        //login
        case loginType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingIn: 'inProgress'
                }
            };
        }
        case loginSuccessType:
        {
            return {
                ...oldState,
                user: action.user,
                actions: {
                    ...oldState.actions,
                    loggingIn: 'success'
                }
            };
        }
        case loginFailureType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingIn: 'failure'
                }
            };
        }

        //logout
        case logoutType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingOut: 'inProgress'
                }
            };
        }
        case logoutSuccessType:
        {
            return { //@todo: bad idea -> removes all locations -> sugar the initial state with the correct locations
                ...oldState,
                initialState
            };
        }
        case logoutFailureType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingOut: 'failure'
                }
            };
        }

        //changePassword
        case changePasswordType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: 'inProgress'
                }
            };
        }
        case changePasswordSuccessType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: 'success'
                }
            };
        }
        case changePasswordFailureType:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: 'failure'
                }
            };
        }


        //UI management
        case setFollowUserType:
        {
            return {
                ...oldState,
                followUser: action.value
            };
        }
        case dialogCloseType:
        {
            return {
                ...oldState,
                openDialog: false
            };
        }
        case dialogOpenType:
        {
            return {
                ...oldState,
                openDialog: action.dialog
            };
        }

        //locations
        case setCategoriesType:
        {
            return {
                ...oldState,
                categories: action.categories
            };
        }
        case setLocationsType:
        {
            return {
                ...oldState,
                locations: action.locations
            };
        }
        case visitedLocationsType:
        {
            return {
                ...oldState,
                user: {
                    ...oldState.user,
                    visited: {
                        ...oldState.user.visited,
                        ...action.visitedLocation
                    }
                }
            };
        }


        default:
        {
            return oldState;
        }
    }

};