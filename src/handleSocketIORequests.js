import logger from './helper/logger';
import visitedLocationAction from './view/action/visitedLocation';

//@todo: too much logic in here. Buisness Logic should be abstracted from the interface
export default module.exports = (sendActionToAllConnectionOfAUser, dataRepository) => {

    return (userSocket) => {

        userSocket.on('log', (message) => {
            console.log(message);
        });

        //@todo: a wrapper that ensures that the user is really logged in by checking userSocket.request.user
        userSocket.on('visitedLocation', (visitedLocation) => {

            const userId = userSocket.request.user._id;
            const visitedLocationLogger = logger.child({userId, visitedLocation});

            dataRepository.findUserById(userId)
                .then((user)=> {
                    return user.visitedLocation(visitedLocation);
                })
                .then((newVisit)=> {
                    if (!newVisit) {
                        visitedLocationLogger.warn('user was here already, he should not send this twice');
                    } else {
                        visitedLocationLogger.info('User visited new location');

                    }
                    sendActionToAllConnectionOfAUser(userId, visitedLocationAction({[visitedLocation]: newVisit}));
                })
                .catch((err)=> {
                    visitedLocationLogger.error(err);
                });
        });

    };


};