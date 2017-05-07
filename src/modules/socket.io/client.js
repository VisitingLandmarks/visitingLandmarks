import logger from '../logger/index';
import io from 'socket.io-client';
import {routes} from '../routes';

export const LOCATION_VISIT = 'LOCATION_VISIT';
export const LOG = 'LOG';


/**
 * establish socket.io connection for loggedIn Users
 * and manage the state of the connection
 * @param store
 */
export default (store) => {

    let currentState = false;
    window.socket = null;


    const changeState = () => {
        if (!!store.getState().session.user !== currentState) {
            changer[!currentState]();
        }
    };

    /**
     * handles two methods to switch between true(connected) and false(disconnected)
     * @type {{true: (function()), false: (function())}}
     */
    const changer = {
        true: () => {
            currentState = true;
            window.socket = io.connect(routes.root);

            //bind client side events
            window.socket.on('storeAction', store.dispatch);
        },
        false: () => {
            currentState = false;
            window.socket.disconnect();
        },
    };

    store.subscribe(changeState);
    changeState();

};


/**
 * we only have a socket connection when the user is locked in
 * this wrapper checks this and ensures that there is no runtime error for non logged in users
 * @param func
 */
const onlyWhenSocketAvailable = (func) => {
    return function () {
        if (!window.socket) {
            logger.debug(arguments, 'socket connection not available');
            return;
        }

        return func.apply(this, arguments);
    };
};


/**
 * claim that we visited a location
 * @param locationId
 */
export const onVisitLocation = onlyWhenSocketAvailable((locationId) => {
    window.socket.emit(LOCATION_VISIT, locationId);
});

export const logRemote = onlyWhenSocketAvailable((data) => {
    window.socket.emit(LOG, data);
});
