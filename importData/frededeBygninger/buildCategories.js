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


LocationModel.find().exec()
    .then((locations)=> {
        return locations.map((location)=> {
            return location.toObject();
        });
    })
    .then((locations)=> {
        return Promise.all([

            saveCategory('Denmark', 'Collect all listed buildings in Denmark!', locations.map(getId)),

            buildByPropertyFactory('Lighthouses', 'Collect all listed lighthouses in Denmark!','complexTypeId', equalFactory(402))(locations),
            buildByPropertyFactory('Harbour Sites', 'Collect all listed harbour sites in Denmark!', 'complexTypeId', equalFactory(465))(locations),
            buildByPropertyFactory('Palaces', 'Collect all listed palaces in Denmark!', 'complexTypeId', equalFactory(603))(locations),
            buildByPropertyFactory('Watertowers', 'Collect all listed watertowers in Denmark!', 'complexTypeId', equalFactory(270))(locations),
            buildByPropertyFactory('Warehouse 6 not 13', 'Collect all listed warehouses in Denmark!', 'complexTypeId', equalFactory(170))(locations),

            buildByPropertyFactory('Power Plants', 'Collect all listed power plants in Denmark!', 'usageId', equalFactory(391))(locations),
            buildByPropertyFactory('Carports', 'Yes, there are listed carports. Go for this special collection!', 'usageId', equalFactory(408))(locations),

            buildByPropertyFactory('Glass Houses', 'Collect all houses that are mostly built from glass', ['material','outerWallsId'], equalFactory(464))(locations),

            buildByPropertyFactory('Grundlovsdag Collection', 'Collect all listed buildings that were constructed in the same year as Denmarks’ constitution was signed!', 'constructionYear', equalFactory(1849))(locations),
            buildByPropertyFactory('12th and 13th century', 'Collect all listed buildings of the 12th and 13th century!', 'constructionYear', betweenFactory(1100, 1299))(locations),
            buildByPropertyFactory('14th and 15th century', 'Collect all listed buildings of the 14th and 15th century!', 'constructionYear', betweenFactory(1300, 1499))(locations),
            buildByPropertyFactory('Listed millennials', 'Collect all listed buildings of the 21st century!', 'constructionYear', betweenFactory(2000, 2100))(locations),

            buildByPropertyFactory('Northernmost collection', 'Collect all listed buildings in Skagen!', 'postCode', equalFactory(9990))(locations),
            buildByPropertyFactory('Roskilde Festival collection', 'Collect all listed buildings in Roskilde!', 'postCode', equalFactory(4000))(locations),
            buildByPropertyFactory('Eldest Town in Denmark', 'Collect all listed buildings in the eldest town of Denmark!', 'postCode', equalFactory(6760))(locations),


        ]);
    })
    .then(()=> {
        console.log('done');
    })
    .catch((error)=> {
        console.log(error);
    });

