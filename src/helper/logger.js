const bunyan = require('bunyan');
const config = require('../../config');

/**
 * configure log level and nane for logging
 */
const log = bunyan.createLogger({
    name: config.name,
    level : config.logLevel
});

export default module.exports = log;