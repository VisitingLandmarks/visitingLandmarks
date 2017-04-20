import logger from '../../../modules/logger';

export default module.exports = (mongoDB, schemaDefinition) => {

    schemaDefinition.imageId = {
        type: String,
        unique: true,
        sparse: true,
    };

    return (userSchema) => {

        // let UserModel;

        userSchema.methods.setImage = function (imageId) {

            this.imageId = imageId;
            return this.save().catch((err) => {
                logger.error({err}, 'mongoDB Error in User.setImage');
            });

        };


        // return (model) => {
        //     UserModel = model;
        // };
    };

};