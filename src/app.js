import config from '../config';

//setup express
const express = require('express');
const {app, server} = require('./express.js')(express, config.port);

//setup routes
app.use('/static', express.static('static'));

//setup mongoDB
const getModel = require('./mongoDB.js')(config.mongoDB);

const passportSocketIo = require('passport.socketio');
const getConnectionByUserId = (userId) => {
    userId = userId && userId.toString();
    return passportSocketIo.filterSocketsByUser(io, (user)=> {
        return userId && user._id && userId === user._id.toString();
    });
};

//setup io
const io = require('socket.io')(server);
io.on('connection', require('./userBinding.js')(getModel, getConnectionByUserId));

//setup authentication
const authentication = require('./authentication/main.js')(app, io, getModel('user'));

//and now handle requests
require('./handleRequests.js')(app, getConnectionByUserId, getModel);

//
// const UserModel = getModel('user');
// UserModel.register('admin@test.com', 'admin', 'admin', true);