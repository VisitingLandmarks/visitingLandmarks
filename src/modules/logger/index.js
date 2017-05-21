import bunyan from 'bunyan';
import config from '../../../config';
import RemoteStream from './remoteStream';
import uuid from 'uuid';

/**
 * setup the logger for backend and extend if needed for frondend
 */
const setupLogger = () => {
    const logger = bunyan.createLogger({
        name: config.name,
        level: config.logLevel,
    });

    // extend with custom stream for remote browser logging
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
const logger = setupLogger();
export default logger;

/**
 * wrap a promise with log events
 * @param name
 * @param functionToWrap
 * @param logArgs
 * @param logData
 * @returns {function(...[*])}
 */
export const wrapPromise = (name, functionToWrap, logArgs = true, logData = false) => {
    return (...args) => {
        // a call id that allow to trace and reconstruct a promise usage
        const logChild = logger.child({'call-Id': uuid()});

        logChild.trace({args: logArgs && args}, name + ': called');
        return functionToWrap(...args)
            .then((data) => {
                logChild.info({data: logData && data}, name + ': success');
                return data;
            })
            .catch((err) => {
                logChild.error({err}, name + ': failure');
                throw err;
            });
    };
};
