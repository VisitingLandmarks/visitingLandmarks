
module.exports = {
    name: 'visitingLandmarks',
    logLevel: 'error',
    port: 8000,
    baseDomain: 'http://localhost:8001',
    frontendPath: {
        leafLet: 'https://unpkg.com/leaflet@1.0.1/dist/',
        leafLetMarkerCluster: 'https://unpkg.com/leaflet.markercluster@1.0.0-rc.1.0/dist/',
    },
    mongoDB: {
        debug: false,
        connectURI: 'mongodb://localhost', //overwrite mongoDB connection stream
    },
    email: {
        smtpTransport: 'smtps://user%40gmail.com:pass@smtp.gmail.com', //overwrite with SMTP info to send Email,
        sendOptions: {
            from: '"Visiting Landmarks" <info@visitinglandmarks.com>',
        },
    },
};