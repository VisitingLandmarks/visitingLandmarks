import passportSocketIo from 'passport.socketio';
let getConnectionByUserId;

/**
 * a helper that will send a redux action to all connections of a user
 * @param userId
 * @param payload
 */
export default module.exports = (userId, payload) => {
    getConnectionByUserId(userId).forEach(socket => {
        socket.emit('storeAction', payload);
    });
};

export const setIO = (io) => {
    getConnectionByUserId = (userId) => {
        userId = userId && userId.toString();
        return passportSocketIo.filterSocketsByUser(io, (user)=> {
            return userId && user._id && userId === user._id.toString();
        });
    };
};