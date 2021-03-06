import express from 'express';

import auth from './auth';
import admin from './admin';
import preferences from './preferences';
import user from './user';
import home from './home';

import {routes} from '../modules/routes';

export default (app) => {
    app.use(routes.static, express.static('static'));

    admin(app);
    auth(app);
    preferences(app);
    user(app);

    // home should be used at the end.
    home(app);
};
