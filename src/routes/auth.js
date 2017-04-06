import passport from 'passport';

import routes from '../../config/routes';
import {strategyName as facebookStrategyName} from '../modules/authentication/facebook';
import {strategyName as googleStrategyName} from '../modules/authentication/google';


/**
 * authentication routes
 * third party
 * @param app
 */
export default (app) => {

    app.get(
        routes.auth.facebook.entry,
        passport.authenticate(facebookStrategyName, {scope: ['email']})
    );

    app.get(
        routes.auth.facebook.callback,
        passport.authenticate(facebookStrategyName, {failureRedirect: routes.user.login}),
        (req, res) => res.redirect(routes.root)
    );


    app.get(
        routes.auth.google.entry,
        passport.authenticate(googleStrategyName, {
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                // 'https://www.googleapis.com/auth/plus.login',
                // 'https://www.googleapis.com/auth/plus.profile.emails.read',
            ],
        }
        ));

    app.get(
        routes.auth.google.callback,
        passport.authenticate(googleStrategyName, {
            successRedirect: routes.root,
            failureRedirect: routes.user.login,
            // (req, res) => res.redirect(routes.root)
        })
    );

};