module.exports = {
    port : process.env.PORT,
    mongoDB:{
        debug : false,
        connectURI: process.env.MONGODB_CONNECT_URI
    }
};