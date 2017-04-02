//UI management
import {FOLLOW_USER_SET, NAVIGATE_TO} from '../../action/ui';
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

        default: {
            return oldState;
        }
    }

};