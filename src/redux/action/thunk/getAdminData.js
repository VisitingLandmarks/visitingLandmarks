import { routes, builder } from '../../../modules/routes';

import axios from 'axios';
import actionBuilder from '../builder';

export const gettingAdminData = 'gettingAdminData';

export const ADMIN_DATA_GET = 'ADMIN_DATA_GET';
export const AdminDataGet = actionBuilder(ADMIN_DATA_GET);

export const ADMIN_DATA_GET_FAILURE = 'ADMIN_DATA_GET_FAILURE';
export const AdminDataGetFailure = actionBuilder(ADMIN_DATA_GET_FAILURE);

export const ADMIN_DATA_GET_SUCCESS = 'ADMIN_DATA_GET_SUCCESS';
export const AdminDataGetSuccess = actionBuilder(ADMIN_DATA_GET_SUCCESS);

export default (modelName) => {
    return (dispatch) => {
        dispatch(AdminDataGet(modelName));
        axios.get(builder(routes.admin.data, modelName))
            .then((response) => dispatch(AdminDataGetSuccess({modelName, data: response.data})))
            .catch((response) => dispatch(AdminDataGetFailure(modelName)));
    };
};
