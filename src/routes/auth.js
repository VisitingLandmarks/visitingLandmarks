import passport from 'passport';

import {routes} from '../modules/routes';
import {
    strategyName as facebookStrategyName,
    enabled as facebookEnabled,
} from '../modules/authentication/facebook';
import {
    strategyName as googleStrategyName,
    enabled as googleEnabled,
} from '../modules/authentication/google';

/**
 * authentication routes
 * third party
 * @param app
 */
export default (app) => {
    if (facebookEnabled()) {
        app.get(
            routes.auth.facebook.entry,
            passport.authenticate(facebookStrategyName, {scope: ['email']})
        );

        app.get(
            routes.auth.facebook.callback,
            passport.authenticate(facebookStrategyName, {
                successRedirect: routes.root,
                failureRedirect: routes.user.login,
            })
        );
    }

    if (googleEnabled()) {
        app.get(
            routes.auth.google.entry,
            passport.authenticate(googleStrategyName, {scope: ['https://www.googleapis.com/auth/userinfo.email']})
        );

        app.get(
            routes.auth.google.callback,
            passport.authenticate(googleStrategyName, {
                successRedirect: routes.root,
                failureRedirect: routes.user.login,
            })
        );
    }
};
