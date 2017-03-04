import * as dataRepository from '../data';
import serverSideView from '../view/serverSide';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

import {loginSuccess} from '../redux/action/thunk/login';
import {categoriesSet} from '../redux/action/categories';
import {locationsSet} from '../redux/action/locations';
import {dialogOpen} from '../redux/action/ui';

export default (req, res) => {

    const store = createStore(reducer, applyMiddleware(thunk));


    if (req.user) {
        store.dispatch(loginSuccess(req.user));
    }

    if (res.locals.openDialog) {
        store.dispatch(dialogOpen(res.locals.openDialog));
    }

    Promise.all([
        dataRepository.getAllCategories().then((categories) => store.dispatch(categoriesSet(categories))),
        dataRepository.getAllLocations().then((locations) => store.dispatch(locationsSet(locations))),
    ])
        .then(() => {
            res.send(serverSideView(store, req.headers['user-agent']));
        });


};

