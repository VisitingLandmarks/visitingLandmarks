const config = {
    name: 'visitingLandmarks',
    logLevel: 'info',
    authProvider: {
        facebook: true,
        google: true,
    },

    map: { //settings for the game logic. Rules, etc.
        tileLocation: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
        visitDistance: {
            lat: 0.1,
            lng: 0.1,
            meters: 50,
        },
    },
};
export default config;