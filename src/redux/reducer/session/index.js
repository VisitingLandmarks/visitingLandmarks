import {REGISTER_SUCCESS} from '../../action/thunk/register';
import initialState from './initialState';


export default (oldState = initialState, action) => {

    switch (action.type) {


        case REGISTER_SUCCESS:
        {
            return {
                ...oldState,
                user: action.user,
            };
        }

        default: {
            return oldState;
        }
    }

};