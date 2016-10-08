//@todo: rebuild using thunk
import io from 'socket.io-client';

/**
 * establish socket.io connection for loggedIn Users
 * and manage the state of the connection
 * @param store
 */
export default (store) => {

    let currentState = false;
    window.socket = null;


    const changeState = () => {
        if (!!store.getState().user !== currentState) {
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
            window.socket = io.connect('/');

            //bind client side events
            window.socket.on('storeAction', store.dispatch);
        },
        false: () => {
            currentState = false;
            window.socket.disconnect();
        }
    };

    store.subscribe(changeState);
    changeState();

};