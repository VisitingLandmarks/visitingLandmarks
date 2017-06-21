import memoize from 'memoizee';
import getMongoModel from './mongoDB';
import flattenObject from '../modules/flattenObject';
import { wrapPromise } from '../modules/logger';

import * as AdminRepo from './admin';

/**
 * a helper that ensures that no full-blown mongoose model leaves the data repository -> just plain objects
 * @param data
 */
const asObject = (data) => data && data.toObject({versionKey: false});

/**
 * wraps all methods of an object with the promise wrapper in default settings
 * @param name
 * @param obj
 * @returns {*}
 */
const wrapAllMethodsOfObject = (name, obj) => {
    return Object.keys(obj).reduce((newObj, elemKey) => {
        newObj[elemKey] = wrapPromise(`Data/${name}.${elemKey}`, obj[elemKey]);
        return newObj;
    }, {});
};

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
const UserModel = getMongoModel('user');
const ImageModel = getMongoModel('image');

export const Admin = wrapAllMethodsOfObject('admin', AdminRepo);

// caching is in the responsibility of the dataRepository
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
            // if the user has an old image associated, get the id before overwrite, so we can delete the images
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

export const user = wrapAllMethodsOfObject('user', {

    // passport.js methods
    authenticate: UserModel.authenticate,
    serializeUser: UserModel.serializeUser,
    deserializeUser: UserModel.deserializeUser,

    confirm: UserModel.confirm,
    register: UserModel.register,
    registerProvider: UserModel.registerProvider,

    /**
     * get a single user based on any provided criteria
     * @param userId
     * @returns {Promise}
     */
    getByCriteria: (criteria) => {
        return UserModel.findOne(criteria).exec()
            .then(asObject);
    },

    /**
     * get a single user based on the ID
     * @param userId
     * @returns {Promise}
     */
    getById: (userId) => {
        return UserModel.findById(userId).exec()
            .then(asObject);
    },

    /**
     * get a single user based on the email
     * @param userId
     * @returns {Promise}
     */
    getByEmail: (email) => {
        return UserModel.getByEmail(email)
            .then(asObject);
    },

    /**
     * get a single user based on the email
     * @param userId
     * @returns {Promise}
     */
    getByResetPasswordToken: (resetPasswordToken) => {
        return UserModel.findOne({resetPasswordToken}).exec()
            .then(asObject);
    },

    isAdmin: (userId) => {
        return UserModel.findById(userId, {isAdmin: 1}).exec()
            .then((user) => !!user.isAdmin);
    },

    /**
     * a user requests a password reset token
     * @param email
     * @returns {Promise.<TResult>|Promise}
     */
    newPasswordToken: (email) => {
        return UserModel.getByEmail(email)
            .then((user) => user.newPasswordResetToken())
            .then(asObject);
    },

    /**
     * set a users password
     * @param userId
     * @param password
     * @returns {Promise.<TResult>}
     */
    setPassword: (userId, password) => {
        return UserModel.findById(userId).exec()
            .then((user) => user.setPassword(password))
            .then(asObject);
    },

    /**
     * path a subset of preferences with a new incremental diff object
     * @param userId
     * @param preferences
     * @returns {Promise.<TResult>}
     */
    patchPreference: (userId, preferences) => {
        return UserModel.findById(userId).exec()
            .then((user) => user.setPreference(preferences))
            .then(asObject);
    },

    /**
     * get the profile image associated with a user
     * @param userId
     * @param data
     */
    getProfileImage: (userId, size) => {
        return UserModel.findById(userId).exec()
            .then((user) => {
                if (!user) {
                    return false;
                }
                return ImageModel.getImage(user.imageId, size);
            });
    },

    /**
     * set a new image to a user and store the image
     * @param userId
     * @param data
     */
    setProfileImage: (userId, data) => {
        return ImageModel.addImageGroup(data).then(({groupId}) => {
            return UserModel.findById(userId).exec().then((user) => {
                // if the user has an old image associated, get the id before overwrite, so we can delete the images
                if (user.imageId) {
                    ImageModel.deleteImageGroup(user.imageId);
                }

                return user.setImage(groupId).then(asObject);
            });
        });
    },
});
