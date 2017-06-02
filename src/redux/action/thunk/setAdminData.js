import { routes, builder } from '../../../modules/routes';

import axios from 'axios';
import actionBuilder from '../builder';

export const settingAdminData = 'settingAdminData';

export const ADMIN_DATA_SET = 'ADMIN_DATA_SET';
export const AdminDataSet = actionBuilder(ADMIN_DATA_SET);

export const ADMIN_DATA_SET_FAILURE = 'ADMIN_DATA_SET_FAILURE';
export const AdminDataSetFailure = actionBuilder(ADMIN_DATA_SET_FAILURE);

export const ADMIN_DATA_SET_SUCCESS = 'ADMIN_DATA_SET_SUCCESS';
export const AdminDataSetSuccess = actionBuilder(ADMIN_DATA_SET_SUCCESS);

export default (modelName, locale, key, value) => {
    return (dispatch) => {
        dispatch(AdminDataSet({modelName, locale, key}));
        axios.post(builder(routes.admin.data, modelName), {
            locale,
            key,
            value,
        })
            .then((response) => dispatch(AdminDataSetSuccess({modelName, locale, key, data: response.data})))
            .catch((response) => dispatch(AdminDataSetFailure({modelName, locale, key})));
    };
};
