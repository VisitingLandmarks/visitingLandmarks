//UI management
import {DIALOG_OPEN, DIALOG_CLOSE, FOLLOW_USER_SET} from '../../action/ui';
import initialState from './initialState';


export default (oldState = initialState, action) => {

    switch (action.type) {

    case FOLLOW_USER_SET:
        {
            return {
                ...oldState,
                followUser: action.value,
            };
        }

    default: {
        return oldState;
    }
    }

};