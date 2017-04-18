import applicationLogic from './applicationLogic';
import image from './image';
import lifetimeManagement from './lifetimeManagement';
import preferences from './preferences';
export const collectionName = 'User';

/**
 * returns a mongoose model representing a User
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const extensions = [
        applicationLogic,
        image,
        lifetimeManagement,
        preferences,
    ];

    const schemaDefinition = {
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    };

    //allow extensions to extend the schema definition
    const extensionsSchemaDef = extensions.map((extension) => {
        return extension && extension(mongoDB, schemaDefinition);
    });

    const userSchema = new mongoDB.Schema(schemaDefinition, {
        timestamps: true,
        minimize: false,
        collection: collectionName,
    });

    //making sure that the combination of user und visited objects is unique - he either visited or not
    //this index can also help to answer the question if a user has visited a specific building or not yet.
    userSchema.index({_id: 1, visited: 1}, {unique: true});

    //allow extensions to add schema hooks like statics and methods
    const extensionsWithSchema = extensionsSchemaDef.map((extension) => {
        return extension && extension(userSchema);
    });

    //build model based on scheme
    const UserModel = mongoDB.model(collectionName, userSchema);

    //allow extensions to use the build Model, e.g. in static methods
    extensionsWithSchema.forEach((extension) => {
        extension && extension(UserModel);
    });

    return UserModel;

};
