//UI management
import {
    CONVERSION_LOCATION_VISIT_SHOW,
    CONVERSION_LOCATION_VISIT_HIDE,
    FOLLOW_USER_SET,
    NAVIGATE_TO,
} from '../../action/ui';

import {LOGIN_SUCCESS} from '../../action/thunk/login';
import {REGISTER_SUCCESS} from '../../action/thunk/register';

import initialState from './initialState';


export default (oldState = initialState, action) => {

    switch (action.type) {

        case FOLLOW_USER_SET: {
            return {
                ...oldState,
                followUser: action.value,
            };
        }

        case NAVIGATE_TO: {
            return {
                ...oldState,
                navigateTo: {
                    target: action.value,
                },
            };
        }

        case CONVERSION_LOCATION_VISIT_SHOW: {
            return {
                ...oldState,
                conversionLocationVisit: action.locationId,
            };
        }

        //if a user successfull logged in or registered, this dialog gets obsolete
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
        case CONVERSION_LOCATION_VISIT_HIDE: {
            return {
                ...oldState,
                conversionLocationVisit: 'closed', //to prevent that this dialog is shown more than once
            };
        }

        default: {
            return oldState;
        }
    }

};