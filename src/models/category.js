/**
 * returns a mongoose model representing a category
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const categorySchema = new mongoDB.Schema({
            name: {
                en : String,
                dk : String
            },
            items: [mongoDB.Schema.ObjectId]
        },
        {
            timestamps: true
        });

    /**
     * return a random user and ignore a array of uuid for the result
     * @param ignoreUUIDs
     * @returns {Promise.<TResult>}
     */
    categorySchema.statics.findAll = ()=> {
        return CategoryModel.find().exec();
    };


    //build model based on scheme
    const CategoryModel = mongoDB.model('Category', categorySchema);

    return CategoryModel;

};
