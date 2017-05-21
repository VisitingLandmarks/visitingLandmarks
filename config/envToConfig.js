module.exports = {
    port: process.env.PORT,
    applicationSalt: process.env.APPLICATION_SALT,
    baseDomain: process.env.BASE_DOMAIN,
    mongoDB: {
        connectURI: process.env.MONGODB_CONNECT_URI,
    },
    email: {
        smtpTransport: process.env.SMTP_TRANSPORT,
    },
    authProvider: {
        facebook: {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        },
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
};
