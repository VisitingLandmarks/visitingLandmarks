import controller from '../controller/home';

export const routes = Object.freeze({
    home: '/',
});

export default (app) => {
    /**
     * handle all get requests on the main address, in short "deliver the app"
     */
    app.get(routes.home, controller);
};