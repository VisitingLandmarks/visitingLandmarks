require('babel-register');

//projection transformation
const proj4 = require('proj4');
proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
const targetProjection = 'EPSG:4326';

const fs = require('fs');
const deepmerge = require('deepmerge');
const promisify = require('es6-promisify');
const readFile = promisify(require("fs").readFile);
const parseXMLString = promisify(require('xml2js').parseString);

//setup target DB
const config = require('../../config');
const getModel = require('../../src/helper/mongoDB.js')(config.mongoDB);
const LocationModel = getModel('location');

const KD_NAME = 'KD_Denkmalobjekte_symbolhaft';

/**
 * prepare a dataset for the DB
 * @param data
 * @returns {{resumptionToken: *, records: *}}
 */
function prepareForImport(data) {
    return data['gml:FeatureCollection']['gml:featureMember'].map(prepareRecord);
}


/**
 * transforming all geo data to a standard
 * @param coordinates
 * @param projection
 * @returns {*}
 */
function normalizeGeo(coordinates, projection) {
    return proj4(projection, targetProjection, coordinates);
}

function prepareRecord(record) {
    try {
        var building = record['fme:'+KD_NAME][0];

        if (building['gml:multiSurfaceProperty']) {
            return;
        }

        var posList = building['gml:pointProperty'][0]
            ['gml:Point'][0]
            ['gml:pos'][0].split(' ');

        var coordinates = normalizeGeo([posList[0], posList[1]], building['gml:pointProperty'][0]['gml:Point'][0]['$'].srsName);

        var data = {
            constructionYear: building['fme:BAUJAHR'] && parseInt(building['fme:BAUJAHR'][0]) || undefined,
            extent: building['fme:INFO'] && building['fme:INFO'][0],
            location: {coordinates},
            name: building['fme:BEZEICHNUNG'] && building['fme:BEZEICHNUNG'][0],
            usageTerm: building['fme:BAUTYP'] && building['fme:BAUTYP'][0],
            source: 'KD_Denkmalobjekte_symbolhaft.gml'
        };

    } catch (e) {
        console.log('cannot extract data from record', e, JSON.stringify(record));
    }

    return data;
}


/**
 * method for post-harvesting, like storing in a database
 * @param data
 */
const harvestingCompleted = (data) => {
    console.log('harvestingCompleted: ' + data.length + ' records');
    Promise.all(data.map((data)=> {
        if (data) {
            return new LocationModel(data).save();
        }

        return true;
        
    }))
        .then(()=> {
            console.log('done');
        })
        .catch((e)=> {
            console.log('error:', e);
        });

};

const next =
    function () {

        return readFile('./KD_Denkmalobjekte_symbolhaft.gml') //get the file at http://suche.transparenz.hamburg.de/dataset/denkmalkartierung-hamburg4#
            .then((xmlString) => parseXMLString(xmlString))
            .then(prepareForImport)
            .then(harvestingCompleted)
            .catch(function (err) {
                console.log(err);
            });
    };


//initial trigger
next();