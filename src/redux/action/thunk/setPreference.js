import {routes} from '../../../modules/routes';

import axios from 'axios';
import builder from '../builder';

export const settingPreference = 'settingPreference';

export const PREFERENCE_SET = 'PREFERENCE_SET';
export const preferenceSet = builder(PREFERENCE_SET);

export const PREFERENCE_SET_FAILURE = 'PREFERENCE_SET_FAILURE';
export const preferenceSetFailure = builder(PREFERENCE_SET_FAILURE);

export const PREFERENCE_SET_SUCCESS = 'PREFERENCE_SET_SUCCESS';
export const preferenceSetSuccess = builder(PREFERENCE_SET_SUCCESS);

export const setPreferenceThunk = (data) => {
    return (dispatch, getStore) => {
        const store = getStore();

        // prevent calls for not logged in users
        if (!store.session.user) {
            return;
        }

        dispatch(preferenceSet());
        axios.post(routes.preferences, data)
            .then((response) => {
                dispatch(preferenceSetSuccess({data}));
            })
            .catch((response) => dispatch(preferenceSetFailure(response)));
    };
};
