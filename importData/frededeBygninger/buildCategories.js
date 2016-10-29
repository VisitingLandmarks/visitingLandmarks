require('babel-register');

//setup target DB
const config = require('../../config');
const getModel = require('../../src/helper/mongoDB.js')(config.mongoDB);
const LocationModel = getModel('location');
const CategoryModel = getModel('category');

LocationModel.getAllAsObject().then((locations) => {
    const category = new CategoryModel({
        name : 'Denmark',
        items : Object.keys(locations)
    });

    category.save();
});