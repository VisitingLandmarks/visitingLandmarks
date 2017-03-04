//UI management
import {DIALOG_OPEN, DIALOG_CLOSE, FOLLOW_USER_SET} from '../../action/ui';
import initialState from './initialState';


export default (oldState = initialState, action) => {

    switch (action.type) {

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

        default: {
            return oldState;
        }
    }

};