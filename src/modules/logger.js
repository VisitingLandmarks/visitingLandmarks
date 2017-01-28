import bunyan from 'bunyan';
import config from '../../config';

/**
 * configure log level and nane for logging
 */
export default module.exports = bunyan.createLogger({
    name: config.name,
    level : config.logLevel
});