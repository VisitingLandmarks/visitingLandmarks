import memoize from 'memoizee';
import logger from '../modules/logger';
import getMongoModel from './mongoDB';
import flattenObject from '../modules/flattenObject';

/**
 * the repository is responsible for all data sources and caches
 * it aggregates those data for the application, a central point were data gets combined
 * @param getModel
 * @returns {{getAllLocationsForUser: (function())}}
 */

export const Category = getMongoModel('category');
export const Intl = getMongoModel('intl');
export const Image = getMongoModel('image');
export const Location = getMongoModel('location');
export const User = getMongoModel('user');

//caching is in the responsibility of the dataRepository
const cache = {
    Category: {
        getAllAsObject: memoize(Category.getAllAsObject, {maxAge: 60 * 60 * 1000}),
    },
    Location: {
        getAllAsObject: memoize(Location.getAllAsObject, {maxAge: 60 * 60 * 1000}),
    },
    Intl: {
        getAllAsObject: memoize(Intl.getAllAsObject, {maxAge: 60 * 60 * 1000}),
    },
};


/**
 * we need all locations with the individual sugar of a given user
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const getAllCategories = () => {
    return cache.Category.getAllAsObject()
        .catch((e) => {
            logger.error(e);
        });

};


/**
 * we need all locations with the individual sugar of a given user
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const getAllLocations = () => {
    return cache.Location.getAllAsObject()
        .catch((e) => {
            logger.error(e);
        });

};


/**
 * we need all locations with the individual sugar of a given user
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const getAllIntl = () => cache.Intl.getAllAsObject();


/**
 * get an intl for a specific locale formated for react-intl
 * @param locale
 * @returns {Promise.<TResult>}
 */
export const getFlatIntlByLocale = (locale) => {
    return getAllIntl().then((intl) => {
        return {
            locale: locale,
            messages: flattenObject(intl[locale] || {}),
        };
    });
};


export const setUserImage = (userId, data) => {

    //@todo: cleanup old images in image collection if user has already an image
    return Image.addImageGroup(data).then(({groupId}) => {
        return findUserById(userId).then((user) => user.setImage(groupId));
    });
};


/**
 * get a single user based on the ID
 * @param userId
 * @returns {Promise}
 */
export const findUserById = (userId) => {
    return User.findById(userId).exec();
};


/**
 * get a single user based on the email
 * @param userId
 * @returns {Promise}
 */
export const findUserByEmail = (email) => {
    return User.findOne({email: email.toLowerCase()}).exec();
};


/**
 * get a single user based on the email
 * @param userId
 * @returns {Promise}
 */
export const findUserByResetPasswordToken = (resetPasswordToken) => {
    return User.findOne({resetPasswordToken}).exec();
};