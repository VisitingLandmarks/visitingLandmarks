import config from '../../../config';

export const strategyName = 'facebook';
const FacebookStrategy = require('passport-facebook').Strategy;
const requiredFields = ['id', 'email'];
import routes from  '../../../config/routes';


/**
 *setup passport to use strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, findOrCreateUser) => {
    passport.use(new FacebookStrategy({
        ...config.authProvider.facebook,
        callbackURL: config.baseDomain + routes.auth.facebook.callback,
        profileFields: requiredFields,
    },
        function (accessToken, refreshToken, profile, cb) {
            findOrCreateUser({email: profile.emails[0].value}, {facebookId: profile.id, email: profile.emails[0].value})
                .catch((err) => cb(err, null))
                .then((user) => cb(null, user));
        }
    ));
};