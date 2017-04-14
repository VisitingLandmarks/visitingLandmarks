import {LOCATION_VISIT, LOG} from '../../config/socketEvents';
import logger from '../modules/logger';

/**
 * we only have a socket connection when the user is locked in
 * this wrapper checks this and ensures that there is no runtime error for non logged in users
 * @param func
 */
const onlyWhenSocketAvailable = (func) => {
    return function () {
        if (!window.socket) {
            logger.debug(arguments, 'socket connection not available');
            return false;
        }

        func.apply(this, arguments);
    };
};


/**
 * claim that we visited a location
 * @param locationId
 */
export const onVisitLocation = onlyWhenSocketAvailable((locationId) => {
    window.socket.emit(LOCATION_VISIT, locationId);
});

export const logRemote = onlyWhenSocketAvailable((log) => {
    window.socket.emit(LOG, log);
});