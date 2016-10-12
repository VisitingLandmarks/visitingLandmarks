import {verify as verifyPassword, generate as generatePasswordHash} from '../helper/password.js';
import generateRandomString from '../helper/generateRandomString.js';
import logger from '../helper/logger.js';


/**
 * returns a mongoose model representing a User
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const userSchema = new mongoDB.Schema({
            //basic user properties
            email: {
                type: String,
                trim: true,
                unique: true,
                lowercase: true,
                required: 'Email address is required',
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/, 'Please fill a valid email address']
            },
            isAdmin: {
                type: Boolean,
                required: true,
                default: false
            },
            isConfirmed: {
                type: Boolean,
                required: true,
                default: false
            },
            confirmationToken: {
                type: String,
                unique: true,
                select: false
            },
            resetPasswordToken: {
                type: String,
                unique: true,
                select: false
            },
            // resetPasswordExpires: Date,
            passwordHash: {
                type: String,
                required: true,
                select: false
            },
            passwordSalt: {
                type: String,
                required: true,
                select: false
            },
            //and now the game based information
            visited: [mongoDB.Schema.Types.ObjectId]
        },
        {
            timestamps: true
        });

    //making sure that the combination of user und visited objects is unique - he either visited or not
    //this index can also help to answer the question if a user has visited a specific building or not yet.
    userSchema.index({_id: 1, visited: 1}, {unique: true});


    /**
     * add a location to the visit history of a user
     * @param locationId
     * @returns {Promise.<TResult>}
     */
    userSchema.methods.visitedLocation = function (locationId) {

        //check if user was here already
        if (~this.visited.indexOf(locationId)) {
            return false;
        }

        return this.update({$addToSet: {visited: locationId}}).exec();
    };


    /**
     * find the user in the db and check the password with the salt and hash
     * @param email
     * @param password
     * @param callback
     */
    userSchema.statics.authenticate = (email, password, callback) => {

        UserModel.findOne({email: email.toLowerCase()}).select('+passwordHash +passwordSalt').exec(function (err, user) {

            if (err) {
                logger.error({email}, 'db error during user authenticate');
                return callback(err, null);
            }

            // no user found just return the empty user
            if (!user) {
                logger.info({email}, 'email not found during user authenticate');
                return callback(err, user);
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
                .catch((error)=> {
                    callback(null, false, {message: 'Incorrect username.'});
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

                return new UserModel({
                    passwordHash,
                    passwordSalt,
                    confirmationToken,
                    email,
                    isAdmin,
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
                this.passwordResetToken = undefined;
                return this.save();
            })
            .catch((message)=> {
                logger.error({userId: this._id, message}, 'mongoDB Error in userSchema.methods.setPassword');
            });


    };


    // userSchema.statics.getConfirmationToken = (userId) => {
    //     return UserModel.findById(userId, 'confirmationToken').select('+confirmationToken').exec();
    // };


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


    //build model based on scheme
    const UserModel = mongoDB.model('User', userSchema);

    return UserModel;

};
