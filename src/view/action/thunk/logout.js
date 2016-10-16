import axios from 'axios';

import requestLogoutAction from '../request/logout';
import requestLogoutActionSuccess from '../request/logoutSuccess';
import requestLogoutActionFailure from '../request/logoutFailure';

export function logoutThunk() {
    return function (dispatch) {
        dispatch(requestLogoutAction());
        axios.post('/logout')
            .then((response) => dispatch(requestLogoutActionSuccess(response)))
            .catch((response) => dispatch(requestLogoutActionFailure(response)));
    };
}