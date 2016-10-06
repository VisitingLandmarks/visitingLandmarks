// This is fired every time the server side receives a request
import serverSide  from './view/serverSide.jsx';
import passport from 'passport';
import logger from './helper/logger';
import {sendUserConfirmed, sendUserRegistered} from './email';

//@todo: too much logic in here. Buisness Logic should be abstracted from the interface
export default module.exports = (app, getConnectionByUserId, sendActionToAllConnectionOfAUser, dataRepository) => {


    function sendUser(req, res) {

        const user = req.user;
        res.json({user});

    }

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
     * handle an incoming email registration
     */
    app.get('/confirm/:confirmationToken', function (req, res) {

        const confirmationToken = req.params.confirmationToken;

        dataRepository.User.confirm(confirmationToken)
            .then((user) => {
                if (!user) {
                    res.status(404).send();
                    return;
                }
                return sendUserConfirmed(user);
            })
            .then(() => {
                res.send();
            })
            .catch((err) => {
                res.status(500).send(err);
            });


    });


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post('/register', function (req, res, next) {

        //register is only possible if not logged in
        if (req.user) {
            logger.warn({
                registeredUser: req.user.email,
                triedToRegister: req.body.username
            }, 'user who is logged in tried to register');
            res.status(403).send();
        }

        dataRepository.User.register(req.body.username, req.body.password)
            .then(sendUserRegistered)
            .then((user)=> {
                next();
            });

    }, passport.authenticate('local'), sendUser);


    /**
     * handle a post on the login route
     * send back the user if successful
     */
    app.post('/login', passport.authenticate('local'), sendUser);


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

