import logger from '../../../modules/logger';

export default module.exports = (mongoDB, schemaDefinition) => {

    schemaDefinition.image = { //@todo: this should clearly be a seperate model, which is just referenced here
        data: {
            type: mongoDB.Schema.Types.Buffer,
            select: false,
        },
        contentType: {type: String, select: false},
        has: Boolean,
    };

    return (userSchema) => {

        let UserModel;

        userSchema.statics.getImage = function (userId) {
            return UserModel.findById(userId, {'image.data': 1, 'image.contentType': 1}).exec()
                .then(({image}) => {
                    return {...image};
                });
        };

        userSchema.methods.setImage = function (image, contentType) {

            if (!image || !contentType) {
                return Promise.reject('no data provided in User.setImage');
            }

            this.image.data = image;
            this.image.contentType = contentType;
            this.image.has = true;

            return this.save().catch((err) => {
                logger.error({err}, 'mongoDB Error in User.setImage');
            });

        };


        return (model) => {
            UserModel = model;
        };
    };

};