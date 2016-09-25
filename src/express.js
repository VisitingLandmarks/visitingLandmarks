const bodyParser = require('body-parser');
const http = require('http');
const bunyanMiddleware = require('bunyan-middleware');
import logger from './helper/logger.js';


/**
 *
 * @param express - the express framework
 * @param port - numerical port to open
 * @returns {{app: *, server: *}}
 */
export default module.exports = (express = require('express'), port = 80) => {

    const app = express();
    const server = http.Server(app);

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    //logging middleware
    app.use(bunyanMiddleware({
        headerName: 'X-Request-Id',
        propertyName: 'reqId',
        logName: 'req_id',
        obscureHeaders: [],
        logger: logger
    }));


    /**
     * error handling during request
     * display 500 and error id to the user and log error internally
     * removing the next will make the function fail. it is only an error handle if all 4 arguments are defined
     */
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        req.log.error(err);
        res.status(500).send(req.reqId);
    });

    //open server on given port. the server is in this moment reachable
    server.listen(port);

    return {
        app,
        server
    };

};