module.exports = {
    name: 'visitingLandmarks',
    logLevel: 'error',
    port: 8000,
    baseDomain: 'http://localhost:8000',
    frontendPath: {
        //@todo: this is needed to load the css plus graphics from the CDN
        //@todo: deliver from own host or at least get the version from package.json
        leafLet: 'https://unpkg.com/leaflet@1.0.3/dist/',
        leafLetMarkerCluster: 'https://unpkg.com/leaflet.markercluster@1.0.4/dist/',
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
    authProvider: {},
    locale: ['en', 'de'],
};