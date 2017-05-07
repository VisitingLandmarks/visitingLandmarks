import bunyan from 'bunyan';
import config from '../../../config';
import RemoteStream from './remoteStream';


/**
 * setup the logger for backend and extend if needed for frondend
 */
const setupLogger = () => {
    const logger = bunyan.createLogger({
        name: config.name,
        level: config.logLevel,
    });

    //extend with custom stream for remote browser logging
    if (global.isBrowser) {
        logger.addStream({
            name: 'Remote Log',
            stream: new RemoteStream(),
            type: 'raw',
            level: config.logLevel,
        });
    }

    return logger;
};

/**
 * export the setup logger
 */
export default setupLogger();
