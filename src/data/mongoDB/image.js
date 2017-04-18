import uuid from 'uuid';
import sharp from 'sharp';
import logger from '../../modules/logger';

export const collectionName = 'Image';

/**
 * returns a mongoose model representing a image
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const imageSchema = new mongoDB.Schema({
        groupId: {
            type: String,
            required: true,
        },
        data: {
            type: mongoDB.Schema.Types.Buffer,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        original: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
        {
            timestamps: true,
            collection: collectionName,
        });


    imageSchema.statics.addImageGroup = function (data, contentType) {

        if (!data || !contentType) {
            return Promise.reject('no data provided in User.setImage');
        }

        return sharp(data)
            .metadata()
            .then((metadata) => {
                console.log(metadata);


                return new ImageModel({
                    groupId: uuid.v4(),
                    data,
                    contentType,
                    height : metadata.height,
                    width : metadata.width,
                    original: true,
                })
                    .save().catch((err) => {
                        logger.error({err}, 'mongoDB Error in User.setImage');
                    });

            });
    };

    //build model based on scheme
    const ImageModel = mongoDB.model(collectionName, imageSchema);


    return ImageModel;

};
