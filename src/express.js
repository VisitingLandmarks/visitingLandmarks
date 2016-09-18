'use strict';
const bodyParser = require('body-parser');
const http = require('http');

module.exports = (express, port) => {

    const app = express();
    const server = http.Server(app);

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    server.listen(port);

    return {
        app,
        server
    };

};