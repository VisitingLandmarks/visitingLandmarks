import {verify as verifyPassword, generate as generatePasswordHash} from '../../../modules/password';
import generateRandomString from '../../../modules/generateRandomString';

import logger from '../../../modules/logger';

export default module.exports = (userSchema) => {

    let UserModel;

    /**
     * find the user in the db and check the password with the salt and hash
     * @param email
     * @param password
     * @param callback
     */
    userSchema.statics.authenticate = (email, password, callback) => {

        email = email.toLowerCase();

        logger.debug({email}, 'authenticate user');

        UserModel.findOne({email}).select('+passwordHash +passwordSalt').exec(function (err, user) {

            if (err) {
                logger.error({email}, 'db error during user authenticate');
                return callback(err, null);
            }

            // no user found just return the empty user
            if (!user) {
                logger.info({email}, 'email not found during user authenticate');
                return callback(null, false, {message: 'Incorrect login'});
            }

            verifyPassword(password, user.passwordHash, user.passwordSalt)
                .then(()=> {

                    // remove password and salt from the result without modifying the document.
                    user = user.toObject();
                    delete user.passwordHash;
                    delete user.passwordSalt;
                    delete user.__v;

                    // return user representing object, not the user model! if everything is ok
                    callback(err, user);
                })
                .catch((err)=> {
                    logger.info({email, err}, 'wrong password during login');
                    callback(null, false, {message: 'Incorrect login'});
                });

        });
    };

//@todo a method to change password -> password reset / password change

    /**
     * register a new user
     * @param email
     * @param clearTextPassword
     * @param name (optional)
     * @returns {Promise}
     */
    userSchema.statics.register = (email, clearTextPassword, isAdmin) => {

        //@todo: verify security level of password
        return generatePasswordHash(clearTextPassword)
            .then((passwordData) => {
                const passwordHash = passwordData.passwordHash;
                const passwordSalt = passwordData.passwordSalt;
                const confirmationToken = generateRandomString();
                const resetPasswordToken = generateRandomString();

                return new UserModel({
                    passwordHash,
                    passwordSalt,
                    confirmationToken,
                    resetPasswordToken,
                    email,
                    isAdmin,
                    visited: {}
                })
                    .save()
                    .then((user)=> {
                        return user.toObject();
                    })
                    .catch((message)=> {
                        logger.error({email, message}, 'mongoDB Error in userSchema.statics.register');
                    });

            });
    };


    /**
     * set a new password reset token
     * which will overwrite the old one -> invalidation of the old one
     * @returns {*}
     */
    userSchema.methods.newPasswordResetToken = function () {

        this.resetPasswordToken = generateRandomString();
        return this.save();

    };


    /**
     * set a new password
     * which will overwrite the old one -> invalidation of the old one
     * @returns {*}
     */
    userSchema.methods.setPassword = function (clearTextPassword) {

        return generatePasswordHash(clearTextPassword)
            .then((passwordData) => {
                this.passwordHash = passwordData.passwordHash;
                this.passwordSalt = passwordData.passwordSalt;
                this.passwordResetToken = generateRandomString();
                return this.save();
            })
            .catch((message)=> {
                logger.error({userId: this._id, message}, 'mongoDB Error in userSchema.methods.setPassword');
            });

    };


    /**
     * set a user to confirmed
     * @param confirmationToken
     * @returns {Promise|Promise.<T>}
     */
    userSchema.statics.confirm = (confirmationToken) => {

        return UserModel.findOne({confirmationToken})
            .then((user) => {

                //the request was successful, but there is no user with that confirmation token
                if (!user) {
                    return;
                }

                user.isConfirmed = true;
                user.confirmationToken = generateRandomString();

                return user.save();
            })
            .catch((err) => {
                logger.error(err, 'error during mail confirmation');
            });
    };


    /**
     * get the minimal unique information to identify a user in sessions
     * used by passport
     * @param user
     * @param done
     */
    userSchema.statics.serializeUser = (user, done) => {
        logger.debug('serialize User');
        done(null, user._id);
    };


    /**
     * deserialize the user to a full model
     * used by passport
     * @param id
     * @param done
     */
    userSchema.statics.deserializeUser = (id, done) => {
        logger.debug('deserialize User');
        UserModel.findById(id).select('-__v').exec(done);
    };

    return (model)=> {
        UserModel = model;
    };

};