import {sendEmailConfirmed, sendEmailUserRegistered, sendEmailUserResetPassword} from '../modules/email';
import * as dataRepository from '../data';
import {disconnectAllSocketsOfUser} from '../modules/sendActionToAllConnectionOfAUser';
import {routes} from '../modules/routes';
import logger from '../modules/logger';
import axios from 'axios';

export const confirm = (req, res, next) => {

    const confirmationToken = req.params.token;

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
            req.log.error({err}, 'Error in user confirm controller');
            next(err);
        });

};


export const logout = (req, res) => {

    const numberOfSockets = disconnectAllSocketsOfUser(req.user._id);
    req.log.info({numberOfSockets, userId: req.user._id}, 'user disconnected');

    req.logout();
    res.redirect(routes.root);

};

export const image = (req, res) => {

    if (!req.user.imageId) {
        res.status(404).send();
        return;
    }

    dataRepository.Image.getImage(req.user.imageId).then(({contentType, data}) => {
        res.contentType(contentType);
        res.send(data);
    });

};


/**
 * find the user in the db and create a new one if not found
 * this is needed for social media logins
 * @param providerCriteria
 * @param emailCriteria
 */
export const registerProvider = (req, providerCriteria, emailCriteria, data) => {

    // 1. check for provider id
    return dataRepository.User.findOne(providerCriteria).then((user) => {


        if (user) { // 2. if provider id is found -> login (don't sync email)
            return user;
        }

        //3. if not found, check email
        return dataRepository.User.findOne(emailCriteria).then((user) => {

            if (user) { // 3a. if email is used by other user -> login as this user and add provider id

                //update user with data provided
                Object.keys(providerCriteria).forEach((key) => {
                    user[key] = providerCriteria[key];
                }); //@todo: send email telling the user that his account got connected

                logger.info({id: user._id, ...providerCriteria}, 'user associated with auth provider');

                return user.save();
            }

            const userData = {
                ...providerCriteria,
                ...emailCriteria,
                preferences: {
                    locale: data.locale,
                },
            };


            // 3b. if email is not used -> create new user
            return dataRepository.User.registerProvider(userData).then((user) => {

                return Promise.all([
                    sendEmailUserRegistered(user),
                    data.image && axios.get(data.image, {responseType: 'arraybuffer'})
                        .then((response) => dataRepository.setUserImage(user._id, response.data, response.headers['content-type'])),
                ])
                // return now the user back to function caller
                    .then(() => user)
                    .catch((err) => {
                        req.log.error({err}, 'error in userController.registerProvider');
                    });
            });

        });

    });
};


export const register = (req, res, next) => {

    //register is only possible if not logged in
    if (req.user) {
        req.log.warn({
            registeredUser: req.user.email,
            triedToRegister: req.body.username,
        }, 'user who is logged in tried to register');
        res.status(403).send();
        return;
    }


    dataRepository.User.register(req.body.username, req.body.password, req.locale)
        .then((user) => {
            req.log.debug({email: req.body.username, password: req.body.password}, 'new user registered');
            sendEmailUserRegistered(user)
                .then(() => {
                    //invoke next middleware, which will authenticate the new registered user
                    next();
                });
        })
        .catch((err) => {
            //@todo: this will just throw a error Id at the user. Handle standard cases, like user already exists
            next(err); //@todo: this will in worst case the whole mongodb operation, which can include credentials
        });

};


export const passwordChange = (req, res) => {
    req.user.setPassword(req.body.password);
    res.send();
};

export const passwordResetRequest = (req, res) => {

    //resetPassword is only possible if not logged in
    if (req.user) {
        req.log.warn({
            registeredUser: req.user.email,
            triedToReset: req.body.username,
        }, 'user who is logged in tried to reset password');
        res.status(403).send();
        return;
    }

    dataRepository.findUserByEmail(req.body.username)
        .then((user) => {
            if (!user) {
                throw 'user during request does not exist';
            }
            return user.newPasswordResetToken()
                .then(sendEmailUserResetPassword)
                .then(() => {
                    res.send();
                });
        })
        .catch((err) => {
            req.log.error(err, 'unable to handle resetPassword request');
            res.status(403).send();
        });

};


export const passwordReset = (req, res, next) => {

    const resetPasswordToken = req.params.resetPasswordToken;

    dataRepository.findUserByResetPasswordToken(resetPasswordToken)
        .then((user) => {

            if (!user) {
                res.status(404).send(); //@todo: style -> this shows now the generic cannot GET Express error page
                return;
            }

            req.login(user, function (err) {
                if (err) {
                    req.log.error(err, 'cant login user manually during password reset');
                    next(err);
                }

                //@todo: redirect to changePassword Page
                res.redirect(302, routes.root);
            });

        })
        .catch((err) => {
            next(err);
        });

};


export const restrictLoginUser = (req, res, next) => {
    if (!req.user) {
        res.status(403).send();
        return;
    }

    next();
};


/**
 * answer a request with the user object
 */
export const sendUser = (req, res) => {
    res.json({user: req.user});
};