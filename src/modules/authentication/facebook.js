import config from '../../../config';

export const strategyName = 'facebook';
const FacebookStrategy = require('passport-facebook').Strategy;
const requiredFields = ['id', 'email'];
import {routes} from  '../../modules/routes';


/**
 *setup passport to use strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, registerProvider) => {
    passport.use(new FacebookStrategy({
        ...config.authProvider.facebook,
        callbackURL: config.baseDomain + routes.auth.facebook.callback,
        profileFields: requiredFields,
        passReqToCallback : true,
    },
        function (req, accessToken, refreshToken, profile, cb) {
            registerProvider({facebookId: profile.id}, {email: profile.emails[0].value}, req.locale)
                .catch((err) => cb(err, null))
                .then((user) => cb(null, user));
        }
    ));
};