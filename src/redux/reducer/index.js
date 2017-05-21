import { combineReducers } from 'redux';
import communication from './communication';
import control from './control';
import data from './data';
import session from './session';
import {intlReducer} from 'react-intl-redux';

export default combineReducers({
    communication,
    control,
    data,
    session,
    intl: intlReducer,
});
