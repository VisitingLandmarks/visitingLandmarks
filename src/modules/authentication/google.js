import config from '../../../config';

export const strategyName = 'google';
const FacebookStrategy = require('passport-google-oauth2').Strategy;
// const requiredFields = ['id', 'email'];
import {routes} from  '../../modules/routes';

/**
 *setup passport to use strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, registerProvider) => {
    passport.use(new FacebookStrategy({
        ...config.authProvider.google,
        callbackURL: config.baseDomain + routes.auth.google.callback,
        passReqToCallback : true,
    },
        function (req, accessToken, refreshToken, profile, cb) {
            registerProvider({googleId: profile.id}, {email: profile.email}, req.locale)
                .catch((err) => cb(err, null))
                .then((user) => cb(null, user));
        }
    ));
};