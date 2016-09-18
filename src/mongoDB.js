var getMongoDB = function (config) {

    // mongoose library
    const mongoose = require('mongoose');
    mongoose.Promise = global.Promise;

    if (config.debug) {
        mongoose.set('debug', true);
    }

    //first connection
    mongoose.connect(config.connectURI);

    getMongoDB = () => mongoose;

    return mongoose;
};

const models = {};
const getModelFactory = (config) => {

    /**
     * this function initializes the model
     * @param {string} modelName
     * @returns {undefined}
     */
    return (modelName) => {
        return models[modelName] || (models[modelName] = require('./models/' + modelName + '.js')(getMongoDB(config)));
    };
};

module.exports = getModelFactory;