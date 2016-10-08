module.exports = {
    name: 'visitingLandmarks',
    logLevel: 'debug',
    port: 8001,
    mongoDB: {
        debug: true,
        connectURI: 'mongodb://localhost' //overwrite mongoDB connection stream
    },
    email: {
        smtpTransport: 'smtps://user%40gmail.com:pass@smtp.gmail.com', //overwrite with SMTP info to send Email,
        sendOptions: {
            from: '"Visiting Landmarks" <info@visitinglandmarks.com>'
        }
    },
    game: { //settings for the game logic. Rules, etc.
        visitDistance: {
            lat: 0.1,
            lng: 0.1,
            meters: 50
        }
    }
};