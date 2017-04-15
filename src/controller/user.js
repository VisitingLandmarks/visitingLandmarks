import {sendEmailConfirmed, sendEmailUserRegistered, sendEmailUserResetPassword} from '../modules/email';
import * as dataRepository from '../data';
import {disconnectAllSocketsOfUser} from '../modules/sendActionToAllConnectionOfAUser';
import routes from '../../config/routes';
import logger from '../modules/logger';

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


/**
 * find the user in the db and create a new one if not found
 * this is needed for social media logins
 * @param providerCriteria
 * @param emailCriteria
 */
export const registerProvider = (providerCriteria, emailCriteria) => {

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

            // 3b. if email is not used -> create new user
            return dataRepository.User.registerProvider({
                ...providerCriteria,
                ...emailCriteria,
            }).then((user) => {
                return sendEmailUserRegistered(user)
                    .then(() => {
                        return user;
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

    req.log.debug({email: req.body.username, password: req.body.password}, 'new user registered');

    dataRepository.User.register(req.body.username, req.body.password)
        .then((user) => {
            sendEmailUserRegistered(user)
                .then(() => {
                    //invoke next middleware, which will authenticate the new registered user
                    next();
                });
        })
        .catch((err) => {
            next(err);
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