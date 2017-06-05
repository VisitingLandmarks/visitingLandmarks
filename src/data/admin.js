import getMongoModel from './mongoDB';

/**
 * get all models as dynamic object
 */
const models = ['intl'].reduce((obj, name) => {
    obj[name] = getMongoModel('intl');
    return obj;
}, {});

/**
 * get all instances of a given model
 * @param modelName
 */
export const getAll = (modelName) => {
    return models[modelName].find({}).exec();
};

/**
 * set a instance of a given model
 * @param modelName
 * @param args
 */
export const set = (modelName, ...args) => {
    return models[modelName].set(...args);
};
