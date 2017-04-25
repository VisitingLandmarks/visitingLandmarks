import config from '../config';
import setupRoutes from './routes';
import {setupIO} from './modules/sendActionToAllConnectionOfAUser';
import {registerProvider} from './controller/user';
import expressSetup from './modules/express';

//setup datarepository
const data = require('./data');

/*
IMPORTANT: FOR EVERYTHING BELOW, the ORDER is super important. Stuff will break, if order changed
 */

//setup express
const {app, server} = expressSetup(config.port);

//setup io
const io = setupIO(server);

//setup authentication
require('./modules/authentication')(app, io, data.User.serializeUser, data.User.deserializeUser, data.User.authenticate, registerProvider);

//setup routes - very important: apply AFTER authentication
setupRoutes(app);

//setup error logging middleware - very important: apply AFTER Routes
require('./modules/express/errorHandler')(app);