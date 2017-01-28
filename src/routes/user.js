import passport from 'passport';
import * as controller from '../controller/user';

export const routes = Object.freeze({
    confirm: '/confirm/:token',
    login: '/login',
    logout: '/logout',
    register: '/register',
    requestPasswordReset: '/requestPasswordReset',
    resetPassword: '/resetPassword/:resetPasswordToken'
});

export default (app) => {


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post(routes.login, passport.authenticate('local'), controller.sendUser);


    /**
     * logout - post only, get is a bad idea -> prefetch
     */
    app.post(routes.logout, controller.restrictLoginUser, controller.logout);


    /**
     * handle an confirmation url for an email with is send to the user in an email
     * the reason why this is a get
     */
    app.get(routes.confirm, controller.confirm);


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post(routes.register, controller.register, passport.authenticate('local'), controller.sendUser);


    /**
     * request a password reset
     */
    app.post(routes.requestPasswordReset, controller.requestPasswordReset);


    /**
     * reset the password of a user with a token send to a second channel
     */
    app.get(routes.resetPassword, controller.resetPassword);
}