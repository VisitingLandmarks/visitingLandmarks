module.exports = {
    name: 'visitingLandmarks',
    logLevel: 'debug',
    port: 8001,
    mongoDB: {
        debug: true,
        connectURI: 'mongodb://localhost'
    },
    game : { //settings for the game logic. Rules, etc.
        visitDistance : 50
    }
};