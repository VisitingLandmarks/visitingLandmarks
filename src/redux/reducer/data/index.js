import {CATEGORIES_SET} from '../../action/categories';
import {LOCATIONS_SET} from '../../action/locations';
import {INTL_SET} from '../../action/data';
import initialState from './initialState';

export default (oldState = initialState, action) => {
    switch (action.type) {

        case CATEGORIES_SET: {
            return {
                ...oldState,
                categories: action.categories,
            };
        }

        case LOCATIONS_SET: {
            return {
                ...oldState,
                locations: action.locations,
            };
        }

        case INTL_SET: {
            return {
                ...oldState,
                intl: action.intl,
            };
        }

        default: {
            return oldState;
        }
    }
};
