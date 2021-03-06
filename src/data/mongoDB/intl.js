const collectionName = 'Intl';
import set from 'lodash/set';

/**
 * returns a mongoose model representing a category
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {
    const intlSchema = new mongoDB.Schema({
        locale: {
            type: String,
            unique: true,
        },
        messages: mongoDB.Schema.Types.Object,

    },
        {
            timestamps: true,
            collection: collectionName,
        });

    /**
     * get all locations
     * as object with the object id as key
     * @returns {Promise.<TResult>}
     */
    intlSchema.statics.getAllAsObject = () => {
        return IntlModel.find({}).exec()
            .then((intl) => {
                return intl.reduce((obj, intl) => {
                    obj[intl.locale] = intl.messages;
                    return obj;
                }, {});
            });
    };

    /**
     * set a single translation
     * @param locale
     * @param key
     * @param value
     * @returns {Promise.<TResult>}
     */
    intlSchema.statics.set = (locale, key, value) => {
        return IntlModel.findOne({locale}).exec()
            .then((doc) => {
                set(doc.messages, key, value);
                doc.markModified(`messages.${key}`);
                return doc.save();
            });
    };

    // build model based on scheme
    const IntlModel = mongoDB.model(collectionName, intlSchema);

    return IntlModel;
};
