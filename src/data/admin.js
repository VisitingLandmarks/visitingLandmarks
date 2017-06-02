import getMongoModel from './mongoDB';

const models = ['intl'].reduce((obj, name) => {
    obj[name] = getMongoModel('intl');
    return obj;
}, {});

export const getAll = (modelName) => {
    return models[modelName].find({}).exec();
};

export const set = (modelName, ...args) => {
    return models[modelName].set(...args);
};
