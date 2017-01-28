import express from 'express';
import home from './home';
import user from './user';

export default (app) => {

    app.use('/static', express.static('static'));
    
    home(app);
    user(app);

}
