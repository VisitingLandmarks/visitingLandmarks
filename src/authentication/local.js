const LocalStrategy = require('passport-local').Strategy;

export default (app, passport, authenticateUser) => {
    passport.use(new LocalStrategy(authenticateUser));
};