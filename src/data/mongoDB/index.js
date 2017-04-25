import logger from '../../modules/logger';
import config from '../../../config';


/**
 *
 * @param config
 * @returns {*}
 */
let getMongoDB = (config) => { //@todo: check reconnecting and inially down connection is working fine

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


const models = {};

/**
 * this function initializes the model
 * @param {string} modelName
 * @returns {undefined}
 */
export default module.exports = (modelName) => {
    return models[modelName] || (models[modelName] = require('./' + modelName)(getMongoDB(config.mongoDB)));
};