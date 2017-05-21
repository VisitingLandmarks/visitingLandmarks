import deepFreeze from 'deep-freeze';
import expect from 'unexpected';

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

        expect(reducer(oldState, categoriesSet(categories)), 'to equal', newState);
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

        expect(reducer(oldState, locationsSet(locations)), 'to equal', newState);
    });
});
