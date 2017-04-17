import logger from '../../../modules/logger';

export default module.exports = (mongoDB, schemaDefinition) => {

    schemaDefinition.image = {
        data: mongoDB.Schema.Types.Buffer,
        contentType: String,
        select: false,
    };

    return (userSchema) => {

        //unused
        // userSchema.methods.getPreference = function (key) {
        //     return this.preferences[key];
        // };

        userSchema.methods.setImage = function (image, contentType) {

            if (!image || !contentType) {
                return Promise.reject('no data provided in User.setImage');
            }

            this.image.data = image;
            this.image.contentType = contentType;

            return this.save().catch((err) => {
                logger.error({err}, 'mongoDB Error in User.setImage');
            });

        };
    };

};