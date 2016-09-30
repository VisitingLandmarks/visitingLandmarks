module.exports = {
    name: 'visitingLandmarks',
    logLevel: 'debug',
    port: 8001,
    mongoDB: {
        debug: true,
        connectURI: 'mongodb://localhost'
    },
    game: { //settings for the game logic. Rules, etc.
        visitDistance: {
            lat: 0.1,
            lng: 0.1,
            meters: 50
        }
    }
};