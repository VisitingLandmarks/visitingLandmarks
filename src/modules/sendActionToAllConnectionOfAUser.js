import passportSocketIo from 'passport.socketio';
let getConnectionByUserId;
import data from '../data';

/**
 * a helper that will send a redux action to all connections of a user
 * @param userId
 * @param payload
 */
export default sendActionToAllConnectionOfAUser;
const sendActionToAllConnectionOfAUser = (userId, payload) => {
    getConnectionByUserId(userId).forEach(socket => {
        socket.emit('storeAction', payload);
    });
};

export const setupIO = (server) => {
    const ioApp = require('socket.io')(server);
    getConnectionByUserId = (userId) => {
        userId = userId && userId.toString();
        return passportSocketIo.filterSocketsByUser(ioApp, (user)=> {
            return userId && user._id && userId === user._id.toString();
        });
    };
    
    //handle socket.io requests of the user
    ioApp.on('connection', require('../handleSocketIORequests')(sendActionToAllConnectionOfAUser, data));
};
