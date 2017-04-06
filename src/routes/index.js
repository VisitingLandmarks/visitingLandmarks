import express from 'express';

import auth from './auth';
import home from './home';
import user from './user';

import routes from '../../config/routes';

export default (app) => {

    app.use(routes.static, express.static('static'));
    
    auth(app);
    user(app);
    home(app);

};
