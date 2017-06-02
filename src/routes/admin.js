import controller, { getData, setData } from '../controller/admin';
import { restrictAdminUser } from '../controller/restrict';

import { routes } from '../modules/routes';

export default (app) => {
    /**
     * handle all get requests on the admin addresses, in short "deliver the app"
     */
    app.get([
        routes.admin.entry,
    ],
        restrictAdminUser,
        controller);

    app.get(
        routes.admin.data,
        restrictAdminUser,
        getData,
    );

    app.post(
        routes.admin.data,
        restrictAdminUser,
        setData,
    );
};
