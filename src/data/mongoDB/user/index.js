import applicationLogic from './applicationLogic';
import lifetimeManagement from './lifetimeManagement';
import preferences from './preferences';
export const collectionName = 'User';

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
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/, 'Please fill a valid email address'],
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
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
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
        preferences: {
            locale: {
                type: String,
                default: 'en',
            },
        },
            //and now the game based information
        visited: {
            type: mongoDB.Schema.Types.Object,
            required: true,
            default: {},
        },
    },
        {
            timestamps: true,
            minimize: false,
            // collection: collectionName, //todo: use
        });

    //making sure that the combination of user und visited objects is unique - he either visited or not
    //this index can also help to answer the question if a user has visited a specific building or not yet.
    userSchema.index({_id: 1, visited: 1}, {unique: true});

    //the extensions have to be prepared before the model is build.
    const extensions = [
        applicationLogic(userSchema),
        lifetimeManagement(userSchema),
        preferences(userSchema),
    ];

    //build model based on scheme
    const UserModel = mongoDB.model(collectionName, userSchema);
    extensions.forEach((extension) => {
        extension && extension(UserModel);
    });

    return UserModel;

};
