export const collectionName = 'Category';

/**
 * returns a mongoose model representing a category
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const categorySchema = new mongoDB.Schema({
            description: String,
            name: {
                type: String,
                unique: true,
            },
            items: [mongoDB.Schema.ObjectId],
        },
        {
            timestamps: true,
        });

    //safe data we want to use on the map
    const getForUserWhitelist = {
        _id: 1,
        description: 1,
        name: 1,
        items: 1,
    };


    /**
     * get all locations
     * as object with the object id as key
     * @returns {Promise.<TResult>}
     */
    categorySchema.statics.getAllAsObject = () => {
        return CategoryModel.find({}, getForUserWhitelist).exec()
            .then((cateogies) => {
                return cateogies.reduce(function (obj, category) {
                    category = category.toObject();
                    const id = category._id;
                    delete category._id;
                    obj[id] = category;
                    return obj;
                }, {});
            });
    };


    //build model based on scheme
    const CategoryModel = mongoDB.model(collectionName, categorySchema);

    return CategoryModel;

};
