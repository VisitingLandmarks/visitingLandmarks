import logger from '../../../modules/logger';

export default module.exports = (userSchema) => {

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
            .catch((message)=> {
                logger.error({message, locationId, userId: this._id}, 'mongoDB Error in userSchema.methods.visitedLocation');
            });
    };

};