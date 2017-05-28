import * as data from '../data';
import serverSideView from '../view/entry/home/serverSide';

import { loginSuccess } from '../redux/action/thunk/login';
import { categoriesSet } from '../redux/action/categories';
import { locationsSet } from '../redux/action/locations';
import { intlSet } from '../redux/action/data';

import { updateIntl } from 'react-intl-redux';

import react from './react';

/**
 * main controller to handle the home route and render application
 * @param req
 * @param res
 */
export default (req, res) => {
    const actions = [];

    // get user object if there is a user
    (req.user && data.findUserById(req.user) || Promise.resolve()).then((user) => {
        if (user) { // set user into session
            actions.push(loginSuccess({user}));
        }

        // load data store
        Promise.all([
            data.getAllIntl().then((intl) => {
                actions.push(intlSet(intl));
                return data.getFlatIntlByLocale(user && user.preferences.locale || req.locale);
            })
                .then((userIntl) => actions.push(updateIntl(userIntl))),

            // application stuff
            data.getAllCategories().then((categories) => actions.push(categoriesSet(categories))),
            data.getAllLocations().then((locations) => actions.push(locationsSet(locations))),

        ])
            .then(() => react(req, res, actions, serverSideView));
    });
};

