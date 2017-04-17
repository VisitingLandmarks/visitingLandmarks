import {registering} from '../../action/thunk/register';
import {loggingIn} from '../../action/thunk/login';
import {loggingOut} from '../../action/thunk/logout';
import {resettingPassword} from '../../action/thunk/resetPassword';
import {visittingLocation} from '../../action/thunk/visitLocation';

export default {
    [registering]: false,
    [loggingIn]: false,
    [loggingOut]: false,
    changingPassword : false, //@todo: implement
    [resettingPassword] : false,
    [visittingLocation] : {},
};