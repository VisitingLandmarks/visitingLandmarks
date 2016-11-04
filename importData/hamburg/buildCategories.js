require('babel-register');

//setup target DB
const config = require('../../config');
const getModel = require('../../src/helper/mongoDB.js')(config.mongoDB);
const LocationModel = getModel('location');
const CategoryModel = getModel('category');

const getId = (location) => {
    return location._id;
};

const saveCategory = (name, description, items)=> {

    console.log('saving ' + name + ' with ' + items.length + ' items');

    const category = new CategoryModel({
        description,
        name,
        items
    });

    return category.save();
};

const buildByPropertyFactory = (name, description, property, filterFunc)=> {

    if (!Array.isArray(property)) {
        property = [property];
    }

    return (locations)=> {

        const ids = locations
            .filter((location) => {
                let value = property.reduce((location, property)=> {
                    return location && location[property];
                }, location);
                return filterFunc(value);
            })
            .map(getId);

        return saveCategory(name, description, ids);

    };
};

const equalFactory = (target)=> {
    return (comparable) => {
        return comparable === target;
    }
};

const betweenFactory = (low, high)=> {
    return (comparable) => {
        return comparable >= low && comparable <= high;
    }
};


LocationModel.find({source: 'KD_Denkmalobjekte_symbolhaft.gml'}).exec()
    .then((locations)=> {
        return locations.map((location)=> {
            return location.toObject();
        });
    })
    .then((locations)=> {
        return Promise.all([

            saveCategory('Hamburg', 'Collect all listed buildings in Hamburg!', locations.map(getId)),


        ]);
    })
    .then(()=> {
        console.log('done');
    })
    .catch((error)=> {
        console.log(error);
    });

