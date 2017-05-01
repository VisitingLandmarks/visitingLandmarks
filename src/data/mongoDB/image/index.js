import uuid from 'uuid';
import sharp from 'sharp';
import logger from '../../../modules/logger';
import sizes, {defaultSize} from './sizes';

const collectionName = 'Image';
const MIMEType = 'image/jpeg';

//@todo: if more imageTypes are needed this cam easily be extended as factory taking collectionName and sizes as argument

/**
 * returns a mongoose model representing a image
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const imageSchema = new mongoDB.Schema({
        groupId: { //a group contains one unique and optionally several resized images
            type: String,
            required: true,
        },
        data: { //the image itself
            type: mongoDB.Schema.Types.Buffer,
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
        original: { //a flag indicating that this image is used inside this imagegroup to resize pictures
            type: Boolean,
        },
    },
        {
            timestamps: true,
            collection: collectionName,
        });

    imageSchema.index({groupId: 1, width: 1, height: 1}, {unique: true});


    imageSchema.statics.addImageGroup = function (data) {

        if (!data) {
            return Promise.reject('no data provided in User.setImage');
        }
        const image = sharp(data);
        return image
            .metadata()
            .then((metadata) => {

                return image
                    .jpeg() //because of bad users never ever store a user image without reprocessing!
                    .toBuffer()
                    .then((data) => {

                        return new ImageModel({
                            groupId: uuid.v4(),
                            data,
                            height: metadata.height,
                            width: metadata.width,
                            original: true,
                        })
                            .save().catch((err) => {
                                logger.error({err}, 'mongoDB Error in imageSchema.statics.addImageGroup');
                            });
                    });
            });
    };

    imageSchema.statics.deleteImageGroup = function (groupId) {
        return ImageModel.remove({groupId}).exec();
    };

    imageSchema.statics.getImage = function (groupId, size = defaultSize) {

        const {width, height} = sizes[size];

        //try to find image in correct size
        return ImageModel.findOne({groupId, width, height}).exec()
            .then((image) => {

                //image found, no need to resize
                if (image) {
                    return image;
                }

                //do we have an original?
                return ImageModel.findOne({groupId, original: true}).exec()
                    .then((originalImage) => {

                        if (!originalImage) {
                            throw Error('no image for that group id');
                        }

                        //resize the image
                        return sharp(originalImage.data)
                            .resize(width, height)
                            .toBuffer()
                            .then((data) => {
                                return new ImageModel({
                                    groupId,
                                    data,
                                    height,
                                    width,
                                })
                                    .save().catch((err) => { //@todo: if resize is failing, maybe store a flag to prevent many rerender attempts
                                        logger.error({err}, 'mongoDB Error in imageSchema.statics.getImage');
                                    });
                            });
                    });
            }).then((image) => {
                //add mime type and return plain object instead model
                return {
                    data: image.data,
                    contentType: MIMEType,
                };
            });
    };

    //build model based on scheme
    const ImageModel = mongoDB.model(collectionName, imageSchema);

    return ImageModel;

};
