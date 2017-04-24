import config from '../../../config';
import bodyParser  from 'body-parser';
import http from 'http';
import bunyanMiddleware from 'bunyan-middleware';
import logger from '../logger';
import express from 'express';
import helmet  from 'helmet';
import locale from 'locale';
let webpack = require('webpack');
let webpackConfig = require('./webpack.config');
let compiler = webpack(webpackConfig);

/**
 *
 * @param express - the express framework
 * @param port - numerical port to open
 * @returns {{app: *, server: *}}
 */
export default module.exports = (port = 80) => {

    const app = express();

    app.use(helmet()); // security
    app.use(locale(config.locale)); //getting users locale
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    //logging middleware
    app.use(bunyanMiddleware({
        headerName: 'X-Request-Id',
        propertyName: 'reqId',
        logName: 'req_id',
        obscureHeaders: [],
        logger,
    }));
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath,
    }));
    app.use(require('webpack-hot-middleware')(compiler));
    //open server on given port. the server is in this moment reachable
    const server = http.Server(app);
    server.listen(port);

    return {
        app,
        server,
    };

};