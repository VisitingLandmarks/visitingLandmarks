var memoize = require('memoizee');
import logger from './helper/logger';


/**
 * the repository is responsible for all data sources and caches
 * it aggregates those data for the application, a central point were data gets combined
 * @param getModel
 * @returns {{getAllLocationsForUser: (function())}}
 */
export default module.exports = (getModel) => {

    const Location = getModel('location');
    const User = getModel('user');

    //caching is in the responsibility of the dataRepository
    const cache = {
        Location: {
            getAllAsObject: memoize(Location.getAllAsObject, { maxAge: 15 * 60 * 1000 })
        }
    };


    /**
     * we need all locations with the individual sugar of a given user
     * @param user
     * @returns {Promise|Promise.<T>}
     */
    const getAllLocations = () => {
        return cache.Location.getAllAsObject()
            .catch((e)=> {
                logger.error(e);
            });

    };

    /**
     * get a single user based on the ID
     * @param userId
     * @returns {Promise}
     */
    const findUserById = (userId) => {
        return User.findOne(userId).exec();
    };


    return {
        Location,
        User,
        getAllLocations,
        findUserById
    };

};