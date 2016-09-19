const LocalStrategy = require('passport-local').Strategy;


/**
 *setup passport to use a local (manual) strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, authenticateUser) => {
    passport.use(new LocalStrategy(authenticateUser));
};