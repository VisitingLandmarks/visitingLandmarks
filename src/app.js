import config from '../config';


//setup express
const express = require('express');
const {app, server} = require('./express.js')(express, config.port);

//setup routes
app.use('/static', express.static('static'));

//setup mongoDB and datarepository
const getModel = require('./helper/mongoDB.js')(config.mongoDB);
const dataRepository = require('./dataRepository.js')(getModel);

const passportSocketIo = require('passport.socketio');
const getConnectionByUserId = (userId) => {
    userId = userId && userId.toString();
    return passportSocketIo.filterSocketsByUser(io, (user)=> {
        return userId && user._id && userId === user._id.toString();
    });
};

//setup io
const io = require('socket.io')(server);

//sugar a wrapper to send an event to all connections of a given user
const sendActionToAllConnectionOfAUser = require('./helper/sendActionToAllConnectionOfAUser')(getConnectionByUserId);

//handle socket.io requests of the user
io.on('connection', require('./handleSocketIORequests.js')(sendActionToAllConnectionOfAUser, dataRepository));

//setup authentication
require('./authentication/main.js')(app, io, getModel('user'));

//and now handle requests
require('./handleHTTPRequests.js')(app, getConnectionByUserId, sendActionToAllConnectionOfAUser, dataRepository);