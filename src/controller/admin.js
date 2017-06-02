import * as data from '../data';
import serverSideView from '../view/entry/admin/serverSide';

import { loginSuccess } from '../redux/action/thunk/login';
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
        ])
            .then(() => react(req, res, actions, serverSideView));
    });
};

export const getData = (req, res) => {
    data.Admin.getAll(req.params.model)
        .then((data) => {
            res.json(data);
        });
};

export const setData = (req, res) => {
    data.Admin.set(req.params.model, req.body.locale, req.body.key, req.body.value)
        .then((data) => {
            res.json(data);
        });
};

