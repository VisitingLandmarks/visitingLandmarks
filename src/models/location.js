import logger from '../helper/logger.js';


/**
 * returns a mongoose model representing a category
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const locationSchema = new mongoDB.Schema({
            originalUrl: String,
            originalId: {
                type: String,
                unique: true,
                trim: true
            },
            //tricky
            // longitute -> x -> easting
            // latitutde -> y -> northing
            location: {
                'type': {
                    type: String,
                    enum: "Point",
                    default: "Point"
                },
                coordinates: {
                    type: [Number],
                    //https://docs.mongodb.com/v3.0/applications/geospatial-indexes
                    //Store your location data as GeoJSON objects with this coordinate-axis order: longitude, latitude
                    //Leaflet, the frontend uses latitude, longitude... what a mess.
                    default: [0, 0]
                }
            },
            constructionYear: Number,
            buildArea: Number,
            totalArea: Number,
            floors: Number,
            usageId: Number,
            usageTerm: String
        },
        {
            timestamps: true
        });

    //fancy index for geo distance calculation
    locationSchema.index({location: '2dsphere'});


    //build model based on scheme
    const LocationModel = mongoDB.model('Item', locationSchema);

    return LocationModel;

};
