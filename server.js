'use strict';
require('babel-register');

//setup express
const express = require('express');
const {app, server} = require('./src/express.js')(express, 8000);

//setup routes
app.use('/static', express.static('static'));

//setup mongoDB
const getModel = require('./src/mongoDB.js')({
    debug: true,
    connectURI: 'mongodb://localhost/visitingLandmarks'
});

const passportSocketIo = require('passport.socketio');
const getConnectionByUserId = (userId) => {
    userId = userId && userId.toString();
    return passportSocketIo.filterSocketsByUser(io, (user)=> {
        return userId && user._id && userId === user._id.toString();
    });
};

//setup io
const io = require('socket.io')(server);
io.on('connection', require('./src/userBinding.js')(getModel, getConnectionByUserId));


//setup authentication
const authentication = require('./src/authentication/main.js')(app, io, getModel('user'));

//setup logging
const logger = require('./src/logger.js');
var uuid = require('node-uuid');
app.use(function (req, res, next) {
    req.logger = logger.child({reqId: uuid()});
    next();
});

require('./src/handleRequests.js')(app, getConnectionByUserId, getModel);


// const UserModel = getModel('user');
//
// UserModel.register('testing1@test.com', 'pw1');
// UserModel.register('testing2@test.com', 'pw2');
