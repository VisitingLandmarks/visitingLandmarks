import builder from '../builder';

import {onVisitLocation} from '../../../modules/socket.io/client';

export const LOCATIONS_VISIT = 'LOCATIONS_VISIT';
export const locationsVisit = builder(LOCATIONS_VISIT);

export const LOCATIONS_VISIT_SUCCESS = 'LOCATIONS_VISIT_SUCCESS';
export const locationsVisitSuccess = builder(LOCATIONS_VISIT_SUCCESS);

export const visittingLocation = 'visittingLocation';

export default function visitLocationThunk (locationId) {
    return function (dispatch, getStore) {
        const store = getStore();

        // if the location is already in progress, stop here
        if (
            store.communication[visittingLocation][locationId] ||
            store.session.user && store.session.user.visited[locationId]
        ) {
            return;
        }

        dispatch(locationsVisit({locationId}));
        onVisitLocation(locationId);
    };
}
