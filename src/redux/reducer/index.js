//user management
//login
import {REGISTER, REGISTER_FAILURE, REGISTER_SUCCESS} from '../action/thunk/register';

//login
import {LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS} from '../action/thunk/login';

//logout
import {LOGOUT, LOGOUT_FAILURE, LOGOUT_SUCCESS} from '../action/thunk/logout';

//change Password
import {PASSWORD_CHANGE, PASSWORD_CHANGE_FAILURE, PASSWORD_CHANGE_SUCCESS} from '../action/thunk/changePassword';

//UI management
import {DIALOG_OPEN, DIALOG_CLOSE, FOLLOW_USER_SET} from '../action/ui';

//content management
//categories
import {CATEGORIES_SET} from '../action/categories';

//locations
import {LOCATIONS_SET, LOCATIONS_VISIT} from '../action/locations';

// initial state
import initialState from './initialState';

export const inProgress = 'inProgress';
export const failure = 'failure';
export const success = 'success';

export default (oldState = initialState, action) => {

    switch (action.type) {
        //user management

        //register
        case REGISTER:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    registering: inProgress,
                },
            };
        }
        case REGISTER_FAILURE:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    registering: failure,
                },
            };
        }
        case REGISTER_SUCCESS:
        {
            return {
                ...oldState,
                user: action.user,
                actions: {
                    ...oldState.actions,
                    registering: success,
                },
            };
        }

        //login
        case LOGIN:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingIn: inProgress,
                },
            };
        }
        case LOGIN_FAILURE:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingIn: failure,
                },
            };
        }
        case LOGIN_SUCCESS:
        {
            return {
                ...oldState,
                user: action.user,
                actions: {
                    ...oldState.actions,
                    loggingIn: success,
                },
            };
        }

        //logout
        case LOGOUT:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingOut: inProgress,
                },
            };
        }
        case LOGOUT_FAILURE:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    loggingOut: failure,
                },
            };
        }
        case LOGOUT_SUCCESS:
        {
            return {
                ...initialState,
                locations : oldState.locations,
            };
        }

        //changePassword
        case PASSWORD_CHANGE:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: inProgress,
                },
            };
        }
        case PASSWORD_CHANGE_FAILURE:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: failure,
                },
            };
        }
        case PASSWORD_CHANGE_SUCCESS:
        {
            return {
                ...oldState,
                actions: {
                    ...oldState.actions,
                    changingPassword: success,
                },
            };
        }


        //UI management
        case DIALOG_CLOSE:
        {
            return {
                ...oldState,
                openDialog: false,
            };
        }
        case DIALOG_OPEN:
        {
            return {
                ...oldState,
                openDialog: action.dialog,
            };
        }
        case FOLLOW_USER_SET:
        {
            return {
                ...oldState,
                followUser: action.value,
            };
        }

        //categories
        case CATEGORIES_SET:
        {
            return {
                ...oldState,
                categories: action.categories,
            };
        }

        //locations
        case LOCATIONS_SET:
        {
            return {
                ...oldState,
                locations: action.locations,
            };
        }
        case LOCATIONS_VISIT:
        {
            return {
                ...oldState,
                user: {
                    ...oldState.user,
                    visited: {
                        ...oldState.user.visited,
                        ...action.visitedLocation,
                    },
                },
            };
        }


        default:
        {
            return oldState;
        }
    }

};