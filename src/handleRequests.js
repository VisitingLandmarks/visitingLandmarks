// This is fired every time the server side receives a request
import serverSide  from './view/serverSide.jsx';
import passport from 'passport';
import logger from './logger';

export default module.exports = (app, getConnectionByUserId, getModel) => { //eslint-disable-line no-unused-vars

    // We are going to fill these out in the sections to follow
    const handleRender = (req, res) => {

        Promise.all([
            req.user,
            //req.user && Challenge.getByUser(req.user._id),
            req.headers['user-agent']
        ]).then(values => {
            // Send the rendered page back to the client
            res.send(serverSide(...values));
        }, err => {
            res.status(500).send(err);
        });

    };

    app.get('/', handleRender);


    app.post('/login', passport.authenticate('local'), function (req, res) { //eslint-disable-line no-unused-vars

        const user = req.user;
        res.json({
            user
        });

    });


    //logout - post only, get is a bad idea -> prefetch
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

