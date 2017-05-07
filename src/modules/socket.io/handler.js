import {LOCATION_VISIT, LOG} from '../socket.io/client';
import logger from '../logger';
import {locationsVisitSuccess} from '../../redux/action/thunk/visitLocation';
import {findUserById} from '../../data/index';
import omit from 'lodash/omit';


//@todo: too much logic in here. Logic should be abstracted from the interface
export default (sendActionToAllConnectionOfAUser) => {

    return (userSocket) => {

        userSocket.on(LOG, (data) => {
            logger[data.level]({...omit(data, 'level'), clientMsg: data.msg}, 'Frontend Log:' + data.msg);
        });

        //@todo: a wrapper that ensures that the user is really logged in by checking userSocket.request.user
        userSocket.on(LOCATION_VISIT, (visitedLocation) => {

            const userId = userSocket.request.user;
            const visitedLocationLogger = logger.child({userId, visitedLocation});

            findUserById(userId)
                .then((user) => {
                    return user.visitedLocation(visitedLocation);
                })
                .then((newVisit) => {
                    if (!newVisit) {
                        visitedLocationLogger.warn('user was here already, he should not send this twice');
                    } else {
                        visitedLocationLogger.info('User visited new location');

                    }
                    sendActionToAllConnectionOfAUser(userId, locationsVisitSuccess({data: {[visitedLocation]: newVisit}}));
                })
                .catch((err) => {
                    visitedLocationLogger.error(err);
                });
        });

    };


};