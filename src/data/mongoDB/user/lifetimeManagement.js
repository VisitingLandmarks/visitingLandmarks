import {verify as verifyPassword, generate as generatePasswordHash} from '../../../modules/password';
import {string as randomString} from '../../../modules/random';

import logger from '../../../modules/logger';

export default module.exports = (mongoDB, schemaDefinition) => {
    Object.assign(schemaDefinition, {
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: 'Email address is required',
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/, 'Please fill a valid email address'],
        },
        facebookId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        googleId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        isConfirmed: {
            type: Boolean,
            required: true,
            default: false,
        },
        confirmationToken: {
            type: String,
            unique: true,
            select: false,
            sparse: true,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        // resetPasswordExpires: Date,
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        passwordSalt: {
            type: String,
            required: true,
            select: false,
        },
    });

    return (userSchema) => {
        let UserModel;

        /**
         * find the user in the db and check the password with the salt and hash
         * @param email
         * @param password
         * @param done
         */
        userSchema.statics.authenticate = (email, password) => {
            email = email.toLowerCase();

            logger.debug({email}, 'authenticate user');

            return UserModel.findOne({email}).select('+passwordHash +passwordSalt').exec()
                .then((user) => {
                    // no user found just return the empty user
                    if (!user) {
                        logger.info({email}, 'email not found during user authenticate');
                        return false;
                    }

                    return verifyPassword(password, user.passwordHash, user.passwordSalt)
                        .then(() => user._id) // we just want to work with user id. this is available as req.user in controller
                        .catch((err) => {
                            logger.info({email, err}, 'wrong password during login');
                            return false;
                        });
                });
        };

        /**
         * find a model by email
         * @param email
         * @returns {Promise}
         */
        userSchema.statics.getByEmail = (email) => {
            return UserModel.findOne({email: email.toLowerCase()}).exec();
        };

        /**
         * register a new user
         * @param email
         * @param clearTextPassword
         * @param name (optional)
         * @returns {Promise}
         */
        userSchema.statics.register = (email, clearTextPassword, locale, isAdmin) => {
            // @todo: verify security level of password
            return generatePasswordHash(clearTextPassword)
                .then((passwordData) => {
                    const passwordHash = passwordData.passwordHash;
                    const passwordSalt = passwordData.passwordSalt;
                    const confirmationToken = randomString();
                    const resetPasswordToken = randomString();

                    return new UserModel({
                        passwordHash,
                        passwordSalt,
                        confirmationToken,
                        resetPasswordToken,
                        email,
                        preferences: {locale},
                        isAdmin,
                    })
                        .save()
                        // .then((user) =>  user.toObject())
                        .catch((message) => {
                            logger.error({email, message}, 'mongoDB Error in userSchema.statics.register');
                            throw message;
                        });
                });
        };

        /**
         * register a new user
         * @param email
         * @param clearTextPassword
         * @param name (optional)
         * @returns {Promise}
         */
        userSchema.statics.registerProvider = (data) => {
            // @todo: verify security level of password
            return generatePasswordHash()
                .then((passwordData) => {
                    const passwordHash = passwordData.passwordHash;
                    const passwordSalt = passwordData.passwordSalt;
                    const confirmationToken = randomString();
                    const resetPasswordToken = randomString();

                    return new UserModel({
                        ...data,
                        passwordHash,
                        passwordSalt,
                        confirmationToken,
                        resetPasswordToken,
                    })
                        .save()
                        // .then((user) => user.toObject())
                        .catch((message) => {
                            logger.error({
                                ...data,
                                message,
                            }, 'mongoDB Error in userSchema.statics.registerProvider');
                            throw message;
                        });
                });
        };

        /**
         * set a new password reset token
         * which will overwrite the old one -> invalidation of the old one
         * @returns {*}
         */
        userSchema.methods.newPasswordResetToken = function () {
            this.resetPasswordToken = randomString();
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
                    this.passwordResetToken = randomString();
                    return this.save();
                })
                .catch((message) => {
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
                    // the request was successful, but there is no user with that confirmation token
                    if (!user) {
                        return;
                    }

                    user.isConfirmed = true;
                    user.confirmationToken = randomString();

                    return user.save();
                })
                .catch((err) => {
                    logger.error(err, 'error during mail confirmation');
                });
        };

        /**
         * get the minimal unique information to identify a user in sessions
         * used by passport
         * @param id
         */
        userSchema.statics.serializeUser = (id) => {
            return Promise.resolve(id);
        };

        /**
         * deserialize the user -> we just want the user id at controller level
         * used by passport
         * @param id
         */
        userSchema.statics.deserializeUser = (id) => {
            return Promise.resolve(id);
        };

        return (model) => {
            UserModel = model;
        };
    };
};
