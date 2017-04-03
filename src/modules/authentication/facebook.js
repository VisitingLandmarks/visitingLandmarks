const FacebookStrategy = require('passport-facebook').Strategy;
import config from '../../../config';

/**
 *setup passport to use a local (manual) strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, findOrCreateUser) => {
    passport.use(new FacebookStrategy({
        ...config.authProvider.facebook,
        callbackURL: 'http://local.visitinglandmarks.com:8000/auth/facebook/callback',
        profileFields: ['id', 'email'],
    },
        function (accessToken, refreshToken, profile, cb) {
            findOrCreateUser({email: profile.emails[0].value}, {facebookId: profile.id, email: profile.emails[0].value})
                .catch((err) => cb(err, null))
                .then((user) => cb(null, user));
        }
    ));
};