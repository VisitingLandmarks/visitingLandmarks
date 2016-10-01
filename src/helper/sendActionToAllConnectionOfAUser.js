/**
 * a helper that will send a redux action to all connections of a user
 * @param userId
 * @param payload
 */
export default module.exports = (getConnectionByUserId) => {
    return (userId, payload) => {
        getConnectionByUserId(userId).forEach(socket => {
            socket.emit('storeAction', payload);
        });
    };
};
