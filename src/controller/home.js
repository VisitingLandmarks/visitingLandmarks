import * as data from '../data';
import serverSideView from '../view/serverSide';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

import {loginSuccess} from '../redux/action/thunk/login';
import {categoriesSet} from '../redux/action/categories';
import {locationsSet} from '../redux/action/locations';
import {intlSet} from '../redux/action/data';

import {updateIntl} from 'react-intl-redux';


/**
 * main controller to handle the home route and render application
 * @param req
 * @param res
 */
export default (req, res) => {

    const store = createStore(reducer, applyMiddleware(thunk));

    //get user object if there is an user
    (req.user && data.findUserById(req.user) || Promise.resolve()).then((user) => {

        if (user) { //set user into session
            store.dispatch(loginSuccess({user}));
        }

        //load data store
        Promise.all([
            data.getAllIntl().then((intl) => {
                store.dispatch(intlSet(intl));
                return data.getFlatIntlByLocale(user && user.preferences.locale || req.locale);
            })
                .then((userIntl) => {
                    store.dispatch(updateIntl(userIntl));
                }),

            //application stuff
            data.getAllCategories().then((categories) => store.dispatch(categoriesSet(categories))),
            data.getAllLocations().then((locations) => store.dispatch(locationsSet(locations))),

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
            })
            .catch((err) => {
                req.log.error({err}, 'Error in send main app');
                throw err;
            });
    });
};

