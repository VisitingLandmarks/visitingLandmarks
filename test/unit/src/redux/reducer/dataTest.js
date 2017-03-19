import deepFreeze from 'deep-freeze';

import reducer from '../../../../../src/redux/reducer/data';
import initialState from '../../../../../src/redux/reducer/data/initialState';

import {
    CATEGORIES_SET,
    categoriesSet,
} from '../../../../../src/redux/action/categories';

import {
    LOCATIONS_SET,
    locationsSet,
} from '../../../../../src/redux/action/locations';


describe('data reducer', () => {
    it(CATEGORIES_SET, () => {

        const oldState = deepFreeze({
            ...initialState,
        });

        const categories = {a: 'a'};

        const newState = deepFreeze({
            ...initialState,
            categories,
        });

        assert.deepEqual(reducer(oldState, categoriesSet(categories)), newState);

    });

    it(LOCATIONS_SET, () => {

        const oldState = deepFreeze({
            ...initialState,
        });

        const locations = {a: 'a'};

        const newState = deepFreeze({
            ...initialState,
            locations,
        });

        assert.deepEqual(reducer(oldState, locationsSet(locations)), newState);

    });
});