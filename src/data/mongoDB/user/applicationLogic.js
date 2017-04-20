import logger from '../../../modules/logger';

export default module.exports = (mongoDB, schemaDefinition) => {

    schemaDefinition.visited = {
        type: mongoDB.Schema.Types.Object,
        required: true,
        default: {},
    };

    return (userSchema) => {

        //making sure that the combination of user und visited objects is unique - he either visited or not
        //this index can also help to answer the question if a user has visited a specific building or not yet.
        userSchema.index({_id: 1, visited: 1}, {unique: true});


        /**
         * add a location to the visit history of a user
         * @param locationId
         * @returns {Promise.<TResult>}
         */
        userSchema.methods.visitedLocation = function (locationId) {

            //check if user was here already
            if (this.visited[locationId]) {
                return false;
            }

            const timeOfVisit = new Date();
            this.visited[locationId] = timeOfVisit;
            this.markModified('visited');

            return this.save()
                .then(() => timeOfVisit)
                .catch((message) => {
                    logger.error({
                        message,
                        locationId,
                        userId: this._id,
                    }, 'mongoDB Error in userSchema.methods.visitedLocation');
                });
        };

    };
};