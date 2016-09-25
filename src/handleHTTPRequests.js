// This is fired every time the server side receives a request
import serverSide  from './view/serverSide.jsx';
import passport from 'passport';
import logger from './helper/logger.js';


export default module.exports = (app, getConnectionByUserId, dataRepository) => { //eslint-disable-line no-unused-vars

    //const Location = getModel('location');

    /**
     * handle all get requests on the main address, in short deliver the app
     */
    app.get('/', (req, res) => {

        Promise.all([
            //which data is required for rendering?
            req.user, //the user
            dataRepository.getAllLocations(), //all locations
            req.headers['user-agent'] //the user agent
        ]).then(values => {
            // Send the rendered page back to the client
            res.send(serverSide(...values));
        }, err => {
            res.status(500).send(err);
        });

    });


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post('/login', passport.authenticate('local'), function (req, res) {

        const user = req.user;
        res.json({
            user
        });

    });


    /**
     * logout - post only, get is a bad idea -> prefetch
     */
    app.post('/logout', function (req, res) {
        if (req.user) {

            let sockets = getConnectionByUserId(req.user._id);
            let numberOfSockets = sockets.length;

            sockets.forEach((socket)=> {
                socket.disconnect();
            });

            logger.info({numberOfSockets, userId: req.user._id}, 'user disconnected');

            req.logout();
            res.redirect('/');
        }

    });

};

