import logger from './helper/logger';
import visitedLocationAction from './view/action/visitedLocations';

//@todo: too much logic in here. Buisness Logic should be abstracted from the interface
export default module.exports = (sendActionToAllConnectionOfAUser, dataRepository) => {

    return (userSocket) => {

        //@todo: a wrapper that ensures that the user is really logged in by checking userSocket.request.user
        userSocket.on('visitedLocation', (locationId) => {

            const userId = userSocket.request.user._id;
            const visitedLocationLogger = logger.child({userId, locationId});

            dataRepository.findUserById(userId)
                .then((user)=> {
                    return user.visitedLocation(locationId);
                })
                .then((newVisit)=> {
                    if (!newVisit) {
                        visitedLocationLogger.warn('user was here already, he should not send this twice');
                    } else {
                        visitedLocationLogger.info( 'User visited new location');

                    }
                    sendActionToAllConnectionOfAUser(userId, visitedLocationAction(locationId));
                })
                .catch((err)=> {
                    visitedLocationLogger.error(err);
                });
        });

    };


};