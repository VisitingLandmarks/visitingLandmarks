import * as dataRepository from '../data';
import serverSideView from '../view/serverSide';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

import {loginSuccess} from '../redux/action/thunk/login';
import {categoriesSet} from '../redux/action/categories';
import {locationsSet} from '../redux/action/locations';

import {updateIntl} from 'react-intl-redux';


/**
 * main controller to handle the home route and render application
 * @param req
 * @param res
 */
export default (req, res) => {

    const store = createStore(reducer, applyMiddleware(thunk));

    //load i18n into store
    store.dispatch(updateIntl({
        locale: 'en',
        messages: {
            test: 'works!!!',
        },
    }));

    //set user into session
    if (req.user) {
        store.dispatch(loginSuccess({user: req.user}));
    }

    //load data store
    Promise.all([
        dataRepository.getAllCategories().then((categories) => store.dispatch(categoriesSet(categories))),
        dataRepository.getAllLocations().then((locations) => store.dispatch(locationsSet(locations))),
    ])
        .then(() => {

            //server side rendering
            const {status, url, html} = serverSideView(store, req.url, req.headers['user-agent']);

            //and translate the result to express
            switch (status) {

                case 200: {
                    res.send(html);
                    return;
                }

                case 301:
                case 302: {
                    res.redirect(status, url);
                    return;
                }

                default: {
                    throw new Error('unimplemented status code in server side rendering');
                }
            }
        });

};

