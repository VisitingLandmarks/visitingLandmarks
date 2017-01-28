import config from '../config';
import setupRoutes from './routes';

//setup express
const {app, server} = require('./express')(config.port);

//setup routes
setupRoutes(app);

//setup mongoDB and datarepository
const dataRepository = require('./data');

//setup io
const io = require('socket.io')(server);

//sugar a wrapper to send an event to all connections of a given user
const sendActionToAllConnectionOfAUser = require('./modules/sendActionToAllConnectionOfAUser');

//handle socket.io requests of the user
io.on('connection', require('./handleSocketIORequests')(sendActionToAllConnectionOfAUser, dataRepository));

//setup authentication
require('./modules/authentication')(app, io, dataRepository.User.serializeUser, dataRepository.User.deserializeUser, dataRepository.User.authenticate);