import passportSocketIo from 'passport.socketio';

export default (userId) => {
    userId = userId && userId.toString();
    return passportSocketIo.filterSocketsByUser(io, (user)=> {
        return userId && user._id && userId === user._id.toString();
    });
};