//projection transformation
const proj4 = require('proj4');
proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");

//we will chain alot async code so we will promisify it
const promisify = require("es6-promisify");

//getting the source as js object
const parseXMLString = promisify(require('xml2js').parseString);
const readFile = promisify(require('fs').readFile);


readFile('./frededeBygninger.xml')
    .then((data) => parseXMLString(data, {trim: true}))
    .then(prepareForImport)
    .then(saveToDB)
    .catch(function (err) {
        console.error("Yikes!", err);
    });

function prepareForImport(data) {
    const listRecords = data['OAI-PMH'].ListRecords;
    const resumptionToken = listRecords[0].resumptionToken;
    return listRecords[0].record.map(prepareRecord);
}

function prepareRecord(record) {

    const building = record.metadata[0]['fbb:buildingWrap'][0]['fbb:building'][0];
    const BBR = building['fbb:BBR'][0];
    const [x,y] = BBR['fbb:primaryAddress'][0]['fbb:location'][0]['gml:MultiPoint'][0]['gml:pointMember'][0]['gml:Point'][0]['gml:coordinates'][0].split(',');
    const projection = BBR['fbb:primaryAddress'][0]['fbb:location'][0]['gml:MultiPoint'][0]['$']['srsName'];

    const data = {
        originalUrl : building['fbb:id'][0],
        originalId : BBR['fbb:id'][0],
        location : {x,y, projection},
        constructionYear : typeof BBR['fbb:constructionYear'][0] === 'string' && BBR['fbb:constructionYear'][0].split('-')[0],
        buildArea : BBR['fbb:builtArea'][0],
        totalArea : BBR['fbb:totalArea'][0],
        floors : BBR['fbb:floors'][0],
        usageId : BBR['fbb:usage'][0]['fbb:conceptID'][0],
        usageTerm : BBR['fbb:usage'][0]['fbb:term'][0]

    };

    //nteresting -> category?
    BBR['fbb:usage'][0]['fbb:conceptID'][0] //406
    BBR['fbb:usage'][0]['fbb:term'][0] //Anden bygning til fritidsformål
    //more about the material of walls, roof, area etc under BBR.

    //fbb:photographWrap is crap -> just a house on a crappy map

    return data;
}

function saveToDB(data) {
    console.dir(data);
}