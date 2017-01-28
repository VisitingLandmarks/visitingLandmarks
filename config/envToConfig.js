module.exports = {
    port: process.env.PORT,
    baseDomain : process.env.BASE_DOMAIN,
    mongoDB: {
        connectURI: process.env.MONGODB_CONNECT_URI
    },
    email: {
        smtpTransport: process.env.SMTP_TRANSPORT
    }
};