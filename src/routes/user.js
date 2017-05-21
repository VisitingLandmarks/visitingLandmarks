import passport from 'passport';
import {restrictLoggedInUser} from '../controller/restrict';
import * as controller from '../controller/user';
import {routes} from '../modules/routes';
import {postFactory} from '../modules/validation';
import registerSchema from '../modules/validation/schema/register';
import passwordChangeSchema from '../modules/validation/schema/passwordChange';
import {strategyName as localAuthenticationStrategy} from '../modules/authentication/local';

export default (app) => {
    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post(
        routes.user.login,
        passport.authenticate(localAuthenticationStrategy),
        controller.sendUser
    );

    /**
     * logout - post only, get is a bad idea -> prefetch
     */
    app.post(
        routes.user.logout,
        restrictLoggedInUser,
        controller.logout
    );

    /**
     * handle an confirmation url for an email with is send to the user in an email
     * the reason why this is a get
     */
    app.get(
        routes.user.confirm,
        controller.confirm
    );

    app.get(
        routes.user.image,
        restrictLoggedInUser,
        controller.image
    );

    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post(
        routes.user.register,
        postFactory(registerSchema),
        controller.register,
        passport.authenticate(localAuthenticationStrategy),
        controller.sendUser
    );

    /**
     * request a password change
     */
    app.post(
        routes.user.passwordChange,
        restrictLoggedInUser,
        postFactory(passwordChangeSchema),
        controller.passwordChange
    );

    /**
     * request a password reset
     */
    app.post(
        routes.user.passwordResetRequest,
        controller.passwordResetRequest
    );

    /**
     * reset the password of a user with a token send to a second channel
     * this is a get, because of links in email
     */
    app.get(
        routes.user.passwordReset,
        controller.passwordReset
    );
};
