export const LOCATIONS_SET = 'LOCATIONS_SET';
export const locationsSet = (locations) => {
    return {
        type: LOCATIONS_SET,
        locations,
    };
};

export const LOCATIONS_VISIT = 'LOCATIONS_VISIT';
export const locationsVisit = (visitedLocation) => {
    return {
        type: LOCATIONS_VISIT,
        visitedLocation,
    };
};