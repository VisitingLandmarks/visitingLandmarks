import logger from '../logger';
import io from 'socket.io-client';
import { routes } from '../routes';

// event names
import * as events from './events';

/**
 * establish socket.io connection for loggedIn Users
 * and manage the state of the connection
 * @param store
 */
export default (store) => {
    let currentState = false;
    window.socket = null;

    /**
     * checks and changes the connection state if needed
     */
    const updateState = () => {
        if (!!store.getState().session.user !== currentState) {
            toggleState();
        }
    };

    /**
     * well, the toggle toggles the connection state
     */
    const toggleState = () => {
        if (currentState) { // disconnect, if we are connected
            currentState = false;
            window.socket.disconnect();
            return;
        }

        currentState = true;
        const socket = window.socket = io.connect(routes.root);

        // bind client side events
        addEventHandler(socket); // @todo: do we need an unbinding, when we disconnect?
    };

    /**
     * CLIENT SIDE
     * SERVER -> CLIENT
     */
    const addEventHandler = (socket) => {
        socket.on(events.storeAction, store.dispatch);
    };

    // listen to store changes and get initial state
    store.subscribe(updateState);
    updateState();
};

/**
 * we only have a socket connection when the user is locked in
 * this wrapper checks this and ensures that there is no runtime error for non logged in users
 * @param func
 */
const onlyWhenSocketAvailable = (func) => {
    return (...args) => {
        if (!window.socket) {
            logger.debug({method: args[0]}, 'socket connection not available');
            return;
        }

        return func(...args);
    };
};

/**
 * CLIENT SIDE
 * CLIENT -> SERVER
 */

/**
 * send a client log event to the server
 */
export const logRemote = onlyWhenSocketAvailable((log) => {
    window.socket.emit(events.log, log);
});

/**
 * claim that we visited a location
 * @param locationId
 */
export const onVisitLocation = onlyWhenSocketAvailable((locationId) => {
    window.socket.emit(events.locationVisit, locationId);
});
