import config from '../../../config';

export const strategyName = 'google';
const GoogleStrategy = require('passport-google-oauth2').Strategy;

import {routes} from  '../../modules/routes';

/**
 *setup passport to use strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, registerProvider) => {

    if (!enabled()) {
        return;
    }

    passport.use(new GoogleStrategy({
        ...config.authProvider.google,
        callbackURL: config.baseDomain + routes.auth.google.callback,
        passReqToCallback: true,
    },
        function (req, accessToken, refreshToken, profile, cb) {
            registerProvider(req, {googleId: profile.id}, {email: profile.email}, {locale: req.locale})
                .catch((err) => cb(err, null))
                .then((user) => cb(null, user));
        }
    ));
};

export const enabled = () => {
    return !!(
        config.authProvider.google &&
        config.authProvider.google.clientID &&
        config.authProvider.google.clientSecret
    );
};