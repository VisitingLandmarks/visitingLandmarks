import {registering} from '../../action/thunk/register';
import {loggingIn} from '../../action/thunk/login';
import {loggingOut} from '../../action/thunk/logout';
import {resettingPassword} from '../../action/thunk/resetPassword';
import {visittingLocation} from '../../action/thunk/visitLocation';
import {changingPassword} from '../../action/thunk/changePassword';
import {gettingAdminData} from '../../action/thunk/getAdminData';
import {settingAdminData} from '../../action/thunk/setAdminData';

export default {
    [registering]: false,
    [loggingIn]: false,
    [loggingOut]: false,
    [changingPassword]: false,
    [resettingPassword]: false,
    [visittingLocation]: {},
    [gettingAdminData]: {},
    [settingAdminData]: {},
};
