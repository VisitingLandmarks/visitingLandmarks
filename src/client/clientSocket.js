import io from 'socket.io-client';

/**
 * establish socket.io connection for loggedIn Users
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

    const changer = {
        true: () => {
            currentState = true;
            window.socket = io.connect('http://localhost:8000');

            //bind client side events
            window.socket.on('storeAction', store.dispatch);
        },
        false: () => {
            currentState = false;
            window.socket.disconnect();
        }
    }

    store.subscribe(changeState);
    changeState();

}