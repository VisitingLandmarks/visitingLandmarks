'use strict';
const bodyParser = require('body-parser');
const http = require('http');
const bunyanMiddleware = require('bunyan-middleware')
const logger = require('./logger.js');

module.exports = (express, port) => {

    const app = express();
    const server = http.Server(app);

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    app.use(bunyanMiddleware(
        { headerName: 'X-Request-Id'
            , propertyName: 'reqId'
            , logName: 'req_id'
            , obscureHeaders: []
            , logger: logger
        }
    ));

    app.use(function(err, req, res, next) {
        req.log.error(err);
        res.status(500).send(err);
    });

    server.listen(port);

    return {
        app,
        server
    };

};