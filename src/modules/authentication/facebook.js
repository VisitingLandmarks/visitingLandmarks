import config from '../../../config';

export const strategyName = 'facebook';
const FacebookStrategy = require('passport-facebook').Strategy;
const requiredFields = ['id', 'email', 'picture.type(large)'];

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
        passReqToCallback: true,
    },
        function (req, accessToken, refreshToken, profile, cb) {

            registerProvider(
                req,
                {facebookId: profile.id},
                {email: profile.emails[0].value},
                {
                    locale: req.locale,
                    image: profile.photos && profile.photos[0] && profile.photos[0].value,
                }
            )
                .catch((err) => {
                    req.log.error({err}, 'error in facebook auth');
                    cb(err, null);
                })
                .then((user) => cb(null, user));
        }
    ));
};