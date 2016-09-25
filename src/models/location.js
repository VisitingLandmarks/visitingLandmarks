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
                    enum: 'Point',
                    default: 'Point'
                },
                coordinates: {
                    type: [Number],
                    //https://docs.mongodb.com/v3.0/applications/geospatial-indexes
                    //Store your location data as GeoJSON objects with this coordinate-axis order: longitude, latitude
                    //Leaflet, the frontend uses latitude, longitude... what a mess.
                    default: [0, 0]
                }
            },

            postCode: Number,
            postDistrict: String,

            municipalityId: Number,
            municipalityTerm: String,

            complexTypeId: Number,
            complexTypeTerm: String,

            constructionYear: Number,
            conversionYear: Number,
            floors: Number,
            buildArea: Number,
            totalArea: Number,

            material: {
                outerWallsId: Number,
                outerWallsTerm: String,
                roofId: Number,
                roofTerm: String,
                materialsSourceId: Number,
                materialsSourceTerm: String,
                areaSourceId: Number,
                areaSourceTerm: String
            },

            usageId: Number,
            usageTerm: String
        },
        {
            timestamps: true
        });

    //safe data we want to use on the map
    const getForUserWhitelist = {
        _id: 1,
        originalUrl: 1,
        originalId: 1,
        constructionYear: 1,
        location: 1
    };

    //fancy index for geo distance calculation
    locationSchema.index({location: '2dsphere'});


    /**
     * get all locations
     * as object with the object id as key
     * @returns {Promise.<TResult>}
     */
    locationSchema.statics.getAllAsObject = () => {
        return LocationModel.find({}, getForUserWhitelist).exec()
            .then((locations) => {
                return locations.reduce(function(o, v) {
                    v = v.toObject();
                    const id = v._id;
                    delete v._id;
                    o[id] = v;
                    return o;
                }, {});
            });
    };


    //build model based on scheme
    const LocationModel = mongoDB.model('Item', locationSchema);

    return LocationModel;

};