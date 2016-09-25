import {verify as verifyPassword, generate as generatePasswordHash} from '../helper/password.js';
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
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
            },
            name: String,
            isAdmin: {
                type: Boolean,
                required: true,
                default: false
            },
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

        UserModel.findOne({email: email}).select('+passwordHash +passwordSalt').exec(function (err, user) {

            if (err) {
                logger.error({email}, 'db error during user authenticate');
                return callback(err, null);
            }

            // no user found just return the empty user
            if (!user) {
                logger.info({email}, 'email not found during user authenticate');
                return callback(err, user);
            }

            // verify the password with the existing hash from the user
            if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
                return callback(err, null);
            }

            // remove password and salt from the result without modifying the document.
            user = user.toObject();
            delete user.passwordHash;
            delete user.passwordSalt;
            delete user.__v;

            // return user representing object, not the user model! if everything is ok
            callback(err, user);

        });
    };


    /**
     * register a new user
     * @param email
     * @param clearTextPassword
     * @param name (optional)
     * @returns {Promise}
     */
    userSchema.statics.register = (email, clearTextPassword, name, isAdmin) => {

        //@todo: verify security level of password
        return generatePasswordHash(clearTextPassword)
            .then((passwordData) => {
                const passwordHash = passwordData.passwordHash;
                const passwordSalt = passwordData.passwordSalt;

                return new UserModel({
                    passwordHash,
                    passwordSalt,
                    email,
                    isAdmin,
                    name
                }).save().catch((message)=> {
                    logger.error({email, message}, 'mongoDB Error in userSchema.statics.register');
                });

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
