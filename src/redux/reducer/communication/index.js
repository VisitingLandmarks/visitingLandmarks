import deepMerge from 'deepmerge';

import {
    REGISTER,
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    registering,
} from '../../action/thunk/register';

import {
    LOGIN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    loggingIn,
} from '../../action/thunk/login';

import {
    LOGOUT,
    LOGOUT_FAILURE,
    LOGOUT_SUCCESS,
    loggingOut,
} from '../../action/thunk/logout';

import {
    PASSWORD_RESET,
    PASSWORD_RESET_FAILURE,
    PASSWORD_RESET_SUCCESS,
    resettingPassword,
} from '../../action/thunk/resetPassword';

import {
    PASSWORD_CHANGE,
    PASSWORD_CHANGE_FAILURE,
    PASSWORD_CHANGE_SUCCESS,
    changingPassword,
} from '../../action/thunk/changePassword';

import {
    LOCATIONS_VISIT,
    LOCATIONS_VISIT_SUCCESS,
    visittingLocation,
} from '../../action/thunk/visitLocation';

import {
    ADMIN_DATA_GET,
    ADMIN_DATA_GET_SUCCESS,
    gettingAdminData,
} from '../../action/thunk/getAdminData';

import {
    ADMIN_DATA_SET,
    ADMIN_DATA_SET_SUCCESS,
    settingAdminData,
} from '../../action/thunk/setAdminData';

import initialState from './initialState';
import omit from 'lodash/omit';

export const inProgress = 'inProgress';
export const failure = 'failure';
export const success = 'success';

export default (oldState = initialState, action) => {
    switch (action.type) {

        case REGISTER: {
            return {
                ...oldState,
                [registering]: {[inProgress]: true},
            };
        }

        case REGISTER_FAILURE: {
            return {
                ...oldState,
                [registering]: {[failure]: action.error || true},
            };
        }

        case REGISTER_SUCCESS: {
            return {
                ...oldState,
                [registering]: {[success]: true},
            };
        }

        case LOGIN: {
            return {
                ...oldState,
                [loggingIn]: {[inProgress]: true},
            };
        }
        case LOGIN_FAILURE: {
            return {
                ...oldState,
                [loggingIn]: {[failure]: action.error || true},
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...oldState,
                [loggingIn]: {[success]: true},
            };
        }

        case LOGOUT: {
            return {
                ...oldState,
                [loggingOut]: {[inProgress]: true},
            };
        }
        case LOGOUT_FAILURE: {
            return {
                ...oldState,
                [loggingOut]: {[failure]: action.error || true},
            };
        }
        case LOGOUT_SUCCESS: {
            return {
                ...oldState,
                [loggingOut]: {[success]: true},
            };
        }

        case PASSWORD_RESET: {
            return {
                ...oldState,
                [resettingPassword]: {[inProgress]: true},
            };
        }
        case PASSWORD_RESET_FAILURE: {
            return {
                ...oldState,
                [resettingPassword]: {[failure]: action.error || true},
            };
        }
        case PASSWORD_RESET_SUCCESS: {
            return {
                ...oldState,
                [resettingPassword]: {[success]: true},
            };
        }

        case PASSWORD_CHANGE: {
            return {
                ...oldState,
                [changingPassword]: {[inProgress]: true},
            };
        }
        case PASSWORD_CHANGE_FAILURE: {
            return {
                ...oldState,
                [changingPassword]: {[failure]: action.error || true},
            };
        }
        case PASSWORD_CHANGE_SUCCESS: {
            return {
                ...oldState,
                [changingPassword]: {[success]: true},
            };
        }

        case LOCATIONS_VISIT: {
            return {
                ...oldState,
                [visittingLocation]: {
                    ...oldState[visittingLocation],
                    [action.locationId]: true,
                },
            };
        }

        case LOCATIONS_VISIT_SUCCESS: {
            return {
                ...oldState,
                [visittingLocation]: omit(oldState[visittingLocation], Object.keys(action.data)),
            };
        }

        case ADMIN_DATA_GET: {
            return {
                ...oldState,
                [gettingAdminData]: {
                    ...oldState[gettingAdminData],
                    [action.modelName]: {[inProgress]: true},
                },
            };
        }

        case ADMIN_DATA_GET_SUCCESS: {
            return {
                ...oldState,
                [gettingAdminData]: {
                    ...oldState[gettingAdminData],
                    [action.modelName]: {[success]: true},
                },
            };
        }

        case ADMIN_DATA_SET: {
            return deepMerge(oldState, {
                [settingAdminData]: {
                    [action.modelName]: {
                        [action.locale]: {
                            [action.key]: {[inProgress]: true},
                        },
                    },
                },
            });
        }
        case ADMIN_DATA_SET_SUCCESS: {
            return deepMerge(oldState, {
                [settingAdminData]: {
                    [action.modelName]: {
                        [action.locale]: {
                            [action.key]: {[success]: true},
                        },
                    },
                },
            });
        }

        default: {
            return oldState;
        }
    }
};
