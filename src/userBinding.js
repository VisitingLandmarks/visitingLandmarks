const logger = require('./logger');
// import addChallengeAction from './view/action/addChallenge.js';

module.exports = (getModel, getConnectionByUserId) => {


    // const Challenges = getModel('challenge');
    // const Users = getModel('user');
    //
    // const informUserOfNewChallenge = (userId, challenge) => {
    //
    //     getConnectionByUserId(userId).forEach(socket => {
    //         socket.emit('storeAction', addChallengeAction(challenge));
    //     });
    //
    // }

    return (userSocket) => {

        // userSocket.on('addChallenge', (cb)=> {
        //
        //     const userId = userSocket.request.user._id;
        //
        //     Challenges.getOpponentsOfUserInActiveChallenges(userId)
        //         .then((opponents) => {
        //             opponents.push(userId.toString());
        //             return opponents;
        //         })
        //         .then(Users.getRandom)
        //         .then((opponent) => {
        //
        //             //there is no other potential opponent
        //             if (!opponent) {
        //                 throw('no opponent available');
        //             }
        //
        //             return Challenges.add(userId, opponent._id).then(challenge => {
        //                 informUserOfNewChallenge(opponent._id, challenge);
        //                 return challenge;
        //             });
        //         })
        //         .then(cb)
        //         .catch((reason) => {
        //             console.log('rejected', reason);
        //             cb(null, reason);
        //         });
        //
        // });

    };



};