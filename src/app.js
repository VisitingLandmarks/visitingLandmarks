process.traceDeprecation = true;

import config from '../config';
import setupRoutes from './routes';
import {setupIO} from './modules/sendActionToAllConnectionOfAUser';
import {registerProvider} from './controller/user';
//setup express
const {app, server} = require('./modules/express')(config.port);

//setup datarepository
const data = require('./data');

//setup io
const io = setupIO(server);

//setup authentication
require('./modules/authentication')(app, io, data.User.serializeUser, data.User.deserializeUser, data.User.authenticate, registerProvider);

//setup routes - very important: apply AFTER authentication
setupRoutes(app);

//setup error logging middleware - very important: apply AFTER Routes
require('./modules/express/errorHandler')(app);