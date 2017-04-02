import controller from '../controller/home';

import routes from '../../config/routes';

export default (app) => {
    /**
     * handle all get requests on the main addresses, in short "deliver the app"
     */
    app.get([
        routes.root,
        routes.profile,
        routes.user.login,
        routes.user.register,
    ], controller);
};