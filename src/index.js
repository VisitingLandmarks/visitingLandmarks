import config from '../config';
import setupRoutes from './routes';
import setupIO from './modules/socket.io';
import expressSetup from './modules/express';

/*
IMPORTANT: FOR EVERYTHING BELOW, the ORDER is super important. Stuff will break, if order changed
 */

// setup express
const {app, server} = expressSetup(config.port);

// setup io
const io = setupIO(server);

// setup authentication
require('./modules/authentication')(app, io);

// setup routes - very important: apply AFTER authentication
setupRoutes(app);

// setup error logging middleware - very important: apply AFTER Routes
require('./modules/express/errorHandler')(app);
