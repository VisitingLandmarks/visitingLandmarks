import logger from '../helper/logger';

/**
 *
 * @param config
 * @returns {*}
 */
var getMongoDB = (config) => {

    // mongoose library
    const mongoose = require('mongoose');

    //use more powerful native promises
    mongoose.Promise = global.Promise;

    //mongoose way of enabling debugging
    if (config.debug) {
        mongoose.set('debug', true);
    }

    //log errors on DB level
    mongoose.connection.on('error', (error) => {
        logger.error(error, 'MongoDB Error');
    });

    //first connection
    mongoose.connect(config.connectURI, {server: {reconnectTries: Number.MAX_VALUE}});

    //rewrite the getter to just return the instance
    getMongoDB = () => mongoose;

    return mongoose;
};


/**
 * establish a mongo connection
 * @param config object
 * @returns {function()}
 */
const getModelFactory = (config) => {
    const models = {};

    /**
     * this function initializes the model
     * @param {string} modelName
     * @returns {undefined}
     */
    return (modelName) => {
        return models[modelName] || (models[modelName] = require('../models/' + modelName + '.js')(getMongoDB(config)));
    };
};

export default module.exports = getModelFactory;