import express from 'express';
import home from './home';
import user from './user';

export default (app) => {

    app.use('/static', express.static('static'));
    
    user(app);
    home(app);

};
