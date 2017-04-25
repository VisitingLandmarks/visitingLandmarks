import config from '../../../config';

import localStrategy from './local';
import facebookStrategy from './facebook';
import googleStrategy from './google';

import logger from '../../modules/logger';

module.exports = (app, io, serializeUser, deserializeUser, authenticate, registerProvider) => {

    const passport = require('passport');
    const passportSocketIo = require('passport.socketio');
    const session = require('express-session');
    const MongoStore = require('connect-mongo')(session);

    //this is bypassing mongoose
    const store = new MongoStore({url: config.mongoDB.connectURI});

    const secret = 'acf8u5HDhVWBmd8p'; //@todo: config
    const cookieName = 'session';

    //serializing and deserializing a user to a more compact format
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    //setting up session and passport. ORDER IS IMPORTANT for the next app.use commands and the strategy
    app.use(session({
        key: cookieName,
        resave: false,
        saveUninitialized: false,
        store,
        secret,
        cookie: {maxAge: 604800000}, //@todo: config
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    //setup strategies
    localStrategy(app, passport, authenticate);
    facebookStrategy(app, passport, registerProvider);
    googleStrategy(app, passport, registerProvider);

    const onAuthorizeSuccess = (data, accept) => {
        logger.info({userId: data.user._id}, 'socket connection authorized');
        accept();
    };

    const onAuthorizeFail = (data, message, error, accept) => {

        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
        if (error) {
            logger.error({message}, 'error during socket authorize');
            accept(new Error(message));
        }
    };

    //making passport available for socket.io connections
    io.use(passportSocketIo.authorize({
        key: cookieName,
        passport,
        secret,
        store,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail,
    }));


    return passport;
};
