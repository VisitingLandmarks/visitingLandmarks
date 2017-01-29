import {sendEmailConfirmed, sendEmailUserRegistered, sendEmailUserResetPassword} from '../modules/email';
import * as dataRepository from '../data';
import {disconnectAllSocketsOfUser} from '../modules/sendActionToAllConnectionOfAUser';


export const confirm = (req, res) => {

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
            res.status(500).send(err);
        });

};


export const logout = (req, res) => {

    const numberOfSockets = disconnectAllSocketsOfUser(req.user._id);

    req.log.info({numberOfSockets, userId: req.user._id}, 'user disconnected');

    req.logout();
    res.redirect('/');

};


export const register = (req, res, next) => {

    //register is only possible if not logged in
    if (req.user) {
        req.log.warn({
            registeredUser: req.user.email,
            triedToRegister: req.body.username
        }, 'user who is logged in tried to register');
        res.status(403).send();
        return;
    }

    req.log.debug({email: req.body.username, password: req.body.password}, 'new user registered');
    dataRepository.User.register(req.body.username, req.body.password)
        .then((user)=> {
            if (user) {
                sendEmailUserRegistered(user)
                    .then(()=> {
                        //invoke next middleware, which will authenticate the new registered user
                        next();
                    });
            }
        })
        .catch((err) => {
            next(err);
        });

};

export const passwordResetRequest = (req, res) => {

    //resetPassword is only possible if not logged in
    if (req.user) {
        req.log.warn({
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
                .then(sendEmailUserResetPassword)
                .then(()=> {
                    res.send();
                });
        })
        .catch((err)=> {
            req.log.error(err, 'unable to handle resetPassword request');
            res.status(403).send();
        });

};


export const passwordReset = (req, res, next) => {

    const resetPasswordToken = req.params.resetPasswordToken;

    dataRepository.findUserByResetPasswordToken(resetPasswordToken)
        .then((user) => {
            if (!user) {
                res.status(404).send();
                return;
            }

            req.login(user, function (err) {
                if (err) {
                    req.log.error(err, 'cant login user manually during password reset');
                    next(err);
                }

                res.locals.openDialog = 'changePassword'; //@ todo: there is no const for this?

                next();
            });

        })
        .catch((err) => {
            next(err);
        });

};


export const restrictLoginUser = (req, res, next)=> {
    if (!req.user) {
        res.status(403).send();
        return;
    }

    next();
};

/**
 * answer a request with the user object
 */
export const sendUser = (req, res)=> {
    res.json({user: req.user});
};