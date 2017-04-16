import controller from '../controller/home';

import {routes} from '../modules/routes';

export default (app) => {
    /**
     * handle all get requests on the main addresses, in short "deliver the app"
     */
    app.get([
        routes.root,
        routes.profile,
        routes.user.passwordChange,
        routes.user.resetPassword,
        routes.user.login,
        routes.user.register,
    ], controller);
};