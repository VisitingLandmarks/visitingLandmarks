import {LOGIN_SUCCESS} from '../../action/thunk/login';
import {LOGOUT_SUCCESS} from '../../action/thunk/logout';
import {REGISTER_SUCCESS} from '../../action/thunk/register';
import {LOCATIONS_VISIT} from '../../action/session';
import {PREFERENCE_SET_SUCCESS} from '../../action/thunk/setPreference';

import initialState from './initialState';


export default (oldState = initialState, action) => {

    switch (action.type) {

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS: {
            return {
                ...oldState,
                user: action.user,
            };
        }

        case LOGOUT_SUCCESS: {
            return {
                ...oldState,
                user: initialState.user,
            };
        }

        case LOCATIONS_VISIT: {
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

        case PREFERENCE_SET_SUCCESS: {
            return {
                ...oldState,
                user: {
                    ...oldState.user,
                    preferences: {
                        ...oldState.user.preferences,
                        ...action.data,
                    },
                },
            };
        }


        default: {
            return oldState;
        }
    }

};