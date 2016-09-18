const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'visitingLandmarks',
    level : 'debug'
});

module.exports = log;