import logger from '../../modules/logger';
import config from '../../../config';

/**
 *
 * @param config
 * @returns {*}
 */
let getMongoDB = (config) => { // @todo: check reconnecting and inially down connection is working fine
    // mongoose library
    const mongoose = require('mongoose');

    // use more powerful native promises
    mongoose.Promise = global.Promise;

    // mongoose way of enabling debugging
    if (config.debug) {
        mongoose.set('debug', true);
    }

    mongoose.connection.on('connected', () => {
        logger.trace('MongoDB connected');
    });

    mongoose.connection.on('error', (error) => {
        logger.error(error, 'MongoDB Error');
    });

    mongoose.connection.on('reconnected', () => {
        logger.trace('MongoDB reconnected');
    });

    mongoose.connect(config.connectURI, {server: {reconnectTries: Number.MAX_VALUE}});

    // rewrite the getter to just return the instance
    getMongoDB = () => mongoose;

    return mongoose;
};

const models = {};

/**
 * this function initializes the model
 * @param {string} modelName
 * @returns {undefined}
 */
export default (modelName) => {
    return models[modelName] || (models[modelName] = require('./' + modelName)(getMongoDB(config.mongoDB)));
};
