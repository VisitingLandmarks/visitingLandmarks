import config from '../config';
import setupRoutes from './routes';
import {setupIO} from './modules/sendActionToAllConnectionOfAUser';

//setup express
const {app, server} = require('./modules/express')(config.port);

//setup datarepository
const data = require('./data');

//setup io
const io = setupIO(server);

//setup routes
setupRoutes(app);

//setup authentication
require('./modules/authentication')(app, io, data.User.serializeUser, data.User.deserializeUser, data.User.authenticate);
