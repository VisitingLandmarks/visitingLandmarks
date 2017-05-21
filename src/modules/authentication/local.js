export const strategyName = 'local';
const LocalStrategy = require('passport-local').Strategy;

/**
 *setup passport to use strategy
 * @param app
 * @param passport
 * @param authenticateUser
 */
export default (app, passport, authenticateUser) => {
    passport.use(new LocalStrategy(authenticateUser));
};
