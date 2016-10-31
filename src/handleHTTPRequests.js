// This is fired every time the server side receives a request
import serverSide  from './view/serverSide.jsx';
import passport from 'passport';
import logger from './helper/logger';
import onlyLoggedInUsers from './helper/middleware/onlyLoggedInUsers';
import sendUser from './helper/middleware/sendUser';

import {sendEmailConfirmed, sendUserRegistered, sendUserResetPassword} from './email';

/**
 * wire the app, routes and data together
 */
export default module.exports = (app, getConnectionByUserId, sendActionToAllConnectionOfAUser, dataRepository) => {


    /**
     * fetch all data and render it server-side
     * @param params
     * @param res
     */
    const handleMainAppRequests = (params, res) => {

        Promise.all([
            //which data is required for rendering?
            params.user, //the user
            dataRepository.getAllCategories(), //all categories
            dataRepository.getAllLocations(), //all locations
            params.userAgent,//the user agent,
            params.openDialog
        ]).then(values => {
            // Send the rendered page back to the client
            res.send(serverSide(...values));
        }, (err) => {
            res.status(500).send(err);
        });

    };


    /**
     * handle all get requests on the main address, in short deliver the app
     */
    app.get('/', (req, res) => {
        handleMainAppRequests({
            user: req.user,
            userAgent: res.req.headers['user-agent']
        }, res);
    });


    /**
     * handle an confirmation url for an email with is send to the user in an email
     */
    app.get('/confirm/:confirmationToken', (req, res) => {

        const confirmationToken = req.params.confirmationToken;

        dataRepository.User.confirm(confirmationToken)
            .then((user) => {
                if (!user) {
                    res.status(404).send();
                    return;
                }
                return sendEmailConfirmed(user);
            })
            .then(() => {
                res.send();
            })
            .catch((err) => {
                res.status(500).send(err);
            });

    });


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post('/register', (req, res, next) => {

        //register is only possible if not logged in
        if (req.user) {
            logger.warn({
                registeredUser: req.user.email,
                triedToRegister: req.body.username
            }, 'user who is logged in tried to register');
            res.status(403).send();
            return;
        }

        dataRepository.User.register(req.body.username, req.body.password)
            .then((user)=> { //invoke next middleware, which will authenticate the new registered user
                if (user) {
                    sendUserRegistered(user);
                }
                next();
            });

    }, passport.authenticate('local'), sendUser);


    /**
     * request a password reset
     */
    app.post('/resetPassword', (req, res) => {

        //resetPassword is only possible if not logged in
        if (req.user) {
            logger.warn({
                registeredUser: req.user.email,
                triedToReset: req.body.username
            }, 'user who is logged in tried to reset password');
            res.status(403).send();
            return;
        }
        
        dataRepository.findUserByEmail(req.body.username)
            .then((user)=> {
                if (!user) {
                    throw 'user during request does not exist';
                }
                return user.newPasswordResetToken()
                    .then(sendUserResetPassword)
                    .then(()=> {
                        res.send();
                    });
            })
            .catch((err)=> {
                logger.error(err, 'unable to handle resetPassword request');
                res.status(403).send();
            });

    });


    /**
     * reset the password of a user with a token send to a second channel
     */
    app.get('/resetPassword/:resetPasswordToken', (req, res) => {

        const resetPasswordToken = req.params.resetPasswordToken;

        dataRepository.findUserByResetPasswordToken(resetPasswordToken)
            .then((user) => {
                if (!user) {
                    res.status(404).send();
                    return;
                }

                req.login(user, function (err) {
                    logger.error(err, 'cant login user manually during password reset');
                    handleMainAppRequests({
                        user: !err && user,
                        openDialog: 'changePassword'
                    }, res);
                });

            })
            .catch((err) => {
                res.status(500).send(err);
            });

    });


    /**
     * change the password of a logged in user
     */
    app.post('/changePassword', onlyLoggedInUsers, (req, res)=> {

        const newPassword = req.body.password;

        req.user.setPassword(newPassword)
            .then(()=> {
                res.send();
            })
            .catch((err) => {
                res.status(500).send(err);
            });

    });


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post('/login', passport.authenticate('local'), sendUser);


    /**
     * logout - post only, get is a bad idea -> prefetch
     */
    app.post('/logout', (req, res) => {
        if (req.user) {

            let sockets = getConnectionByUserId(req.user._id);
            let numberOfSockets = sockets.length;

            sockets.forEach((socket)=> {
                socket.disconnect();
            });

            logger.info({numberOfSockets, userId: req.user._id}, 'user disconnected');

            req.logout();
            res.redirect('/');
        }

    });

};

