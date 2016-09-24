require('babel-register');

//projection transformation
const proj4 = require('proj4');
proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
const targetProjection = 'EPSG:4326';

const rp = require('request-promise-native');
const deepmerge = require('deepmerge');
const promisify = require("es6-promisify");
const parseXMLString = promisify(require('xml2js').parseString);

//setup target DB
const config = require('../config');
const getModel = require('../src/mongoDB.js')(config.mongoDB);
const LocationModel = getModel('location');

//arguments that are identical for all calls
const baseArgs = {
    uri: 'https://www.kulturarv.dk/repox/OAIHandler',
    qs: {
        'verb': 'ListRecords'
    }
};

//arguments just for the first call
const firstCallArgs = deepmerge(baseArgs, {
    qs: {
        set: 'Listed',
        metadataPrefix: 'fbb'
    }
});


/**
 * prepare a dataset for the DB
 * @param data
 * @returns {{resumptionToken: *, records: *}}
 */
function prepareForImport(data) {
    const listRecords = data['OAI-PMH'].ListRecords;
    const records = listRecords[0].record;
    const resumptionTokenObject = listRecords[0].resumptionToken[0];
    console.log(listRecords[0].record.length);
    console.log(resumptionTokenObject._);
    if (resumptionTokenObject['$']) {

    console.log(resumptionTokenObject['$'].cursor + '+' + records.length + ' of ' + resumptionTokenObject['$'].completeListSize);
    }
    return {
        resumptionToken: resumptionTokenObject._,
        records: listRecords[0].record.map(prepareRecord)
    };
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

        var building = record.metadata[0]['fbb:buildingWrap'][0]['fbb:building'][0];
        var BBR = building['fbb:BBR'][0];
        var coordinates = normalizeGeo(BBR['fbb:primaryAddress'][0]['fbb:location'][0]['gml:MultiPoint'][0]['gml:pointMember'][0]['gml:Point'][0]['gml:coordinates'][0].split(','), BBR['fbb:primaryAddress'][0]['fbb:location'][0]['gml:MultiPoint'][0]['$']['srsName']);

        var data = {
            originalUrl: building['fbb:id'][0],
            originalId: BBR['fbb:id'][0],
            location: {coordinates},
            constructionYear: typeof BBR['fbb:constructionYear'][0] === 'string' && BBR['fbb:constructionYear'][0].split('-')[0],
            buildArea: BBR['fbb:builtArea'] && BBR['fbb:builtArea'][0],
            totalArea: BBR['fbb:totalArea'] && BBR['fbb:totalArea'][0],
            floors: BBR['fbb:floors'] && BBR['fbb:floors'][0],
            usageId: BBR['fbb:usage'] && BBR['fbb:usage'][0] && BBR['fbb:usage'][0]['fbb:conceptID'] && BBR['fbb:usage'][0]['fbb:conceptID'][0],
            usageTerm: BBR['fbb:usage'] && BBR['fbb:usage'][0] && BBR['fbb:usage'][0]['fbb:term'] && BBR['fbb:usage'][0]['fbb:term'][0]

        };
    } catch (e) {
        console.log('cannot extract data from record', e, JSON.stringify(record));
    }
    //Interesting -> category?
    //BBR['fbb:usage'][0]['fbb:conceptID'][0] //406
    //BBR['fbb:usage'][0]['fbb:term'][0] //Anden bygning til fritidsformål
    //more about the material of walls, roof, area etc under BBR.
    //fbb:photographWrap is crap -> just a house on a crappy map

    return data;
}


/**
 * method for post-harvesting, like storing in a database
 * @param data
 */
const harvestingCompleted = (data) => {
    console.log('harvestingCompleted: ' + data.length + ' records');
    data.forEach((data)=> {
        new LocationModel(data).save();
    });
};

const next =
    (function () {
        const recordCollector = [];
        var nextToken;
        var firstRun = true;
        return function () {

            if (!firstRun && !nextToken) {
                harvestingCompleted(recordCollector);
                return;
            }

            var options = firstRun ? firstCallArgs : deepmerge(baseArgs, {
                qs: {
                    resumptionToken: nextToken
                }
            });

            firstRun = false;

            return rp(options)
                .then((xmlString) => parseXMLString(xmlString))
                .then(prepareForImport)
                .then((data) => {
                    nextToken = data.resumptionToken;
                    return data.records;
                })
                .then((records) => {
                    if (records.length) {
                        Array.prototype.push.apply(recordCollector, records);
                        console.log('harvesting in progress:', recordCollector.length);

                        //start next iteration
                        setTimeout(next);
                        return;
                    }
                    harvestingCompleted(recordCollector);

                }).catch(function (err) {
                    console.log(err);
                });
        };
    })();


//initial trigger
next();