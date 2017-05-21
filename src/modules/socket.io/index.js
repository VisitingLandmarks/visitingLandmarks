import passportSocketIo from 'passport.socketio';
import eventHandler from './server';
let getConnectionByUserId;

/**
 * a helper that will send a redux action to all connections of a user
 * @param userId
 * @param payload
 */
export const sendToAllConnectionOfAUser = (userId, event, payload) => {
    getConnectionByUserId(userId).forEach(socket => {
        socket.emit(event, payload);
    });
};

export default (server) => {
    const ioApp = require('socket.io')(server);
    getConnectionByUserId = (userId) => {
        userId = userId && userId.toString();
        return passportSocketIo.filterSocketsByUser(ioApp, (user) => {
            return userId && user._id && userId === user._id.toString();
        });
    };

    // handle socket.io requests of the user
    ioApp.on('connection', eventHandler);

    return ioApp;
};

export const disconnectAllSocketsOfUser = (userId) => {
    const sockets = getConnectionByUserId(userId);
    const numberOfSockets = sockets.length;

    sockets.forEach((socket) => {
        socket.disconnect();
    });

    return numberOfSockets;
};
