import logger from '../logger';
import omit from 'lodash/omit';

// event names
import * as events from './events';

// helper for emitting
import { sendToAllConnectionOfAUser } from './index';

// needed by the handlers
import { locationsVisitSuccess } from '../../redux/action/thunk/visitLocation';
import { findUserById } from '../../data/index';

/**
 * socket.io event handler on server side
 * SERVER SIDE
 * CLIENT -> SERVER
 * @returns {function(*)}
 */
export default (userSocket) => {
    userSocket.on(events.log, (data) => { // @todo: this stuff needs validation to or it can crash the server. also a reusable wrapper for the try catch
        try {
            logger[data.level]({...omit(data, 'level'), clientMsg: data.msg}, 'Frontend Log:' + data.msg);
        } catch (err) {
            logger.error({err}, 'exception in socket.io log event');
        }
    });

    userSocket.on(events.locationVisit, (visitedLocation) => {
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
                storeActionToUsersConnections(userId, locationsVisitSuccess({data: {[visitedLocation]: newVisit}}));
            })
            .catch((err) => {
                visitedLocationLogger.error(err);
            });
    });
};

/**
 * SERVER SIDE
 * SERVER -> CLIENT
 */

/**
 * dispatch an action on all clients of a user
 * @param userId
 * @param payload
 */
export const storeActionToUsersConnections = (userId, payload) => {
    sendToAllConnectionOfAUser(userId, events.storeAction, payload);
};

// @todo: a helper that sends an action to a specific(!) socket.io connection, either via id or instance
