import memoize from 'memoizee';
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
export const getAllCategories = () => cache.Category.getAllAsObject();


/**
 * we need all locations with the individual sugar of a given user
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const getAllLocations = () => cache.Location.getAllAsObject();


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


export const getUserImage = (userId, size) => {

    return findUserById(userId)
        .then((user) => {
            if (!user) {
                return false;
            }
            return Image.getImage(user.imageId, size);
        });
};


/**
 * set a new image to a user and store the image
 * @param userId
 * @param data
 */
export const setUserImage = (userId, data) => {

    return Image.addImageGroup(data).then(({groupId}) => {
        return findUserById(userId).then((user) => {

            //if the user has an old image associated, get the id before overwrite, so we can delete the images
            if (user.imageId) {
                Image.deleteImageGroup(user.imageId);
            }

            return user.setImage(groupId);
        });
    });
};


export const setUserPassword = (userId, password) => {
    return findUserById(userId)
        .then((user) => user.setPassword(password));
};

export const setUserPreference = (userId, preferences) => {
    return findUserById(userId)
        .then((user) => user.setPreference(preferences));
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