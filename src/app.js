import config from '../config';
import setupRoutes from './routes';
import setIO from './modules/sendActionToAllConnectionOfAUser';

//setup express
const {app, server} = require('./modules/express')(config.port);

//setup routes
setupRoutes(app);

//setup datarepository
const data = require('./data');

//setup io
const io = require('socket.io')(server);
setIO(io);

//sugar a wrapper to send an event to all connections of a given user
const sendActionToAllConnectionOfAUser = require('./modules/sendActionToAllConnectionOfAUser');

//handle socket.io requests of the user
io.on('connection', require('./handleSocketIORequests')(sendActionToAllConnectionOfAUser, data));

//setup authentication
require('./modules/authentication')(app, io, data.User.serializeUser, data.User.deserializeUser, data.User.authenticate);