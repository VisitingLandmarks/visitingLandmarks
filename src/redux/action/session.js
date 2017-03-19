export const LOCATIONS_VISIT = 'LOCATIONS_VISIT';
export const locationsVisit = (visitedLocation) => {
    return {
        type: LOCATIONS_VISIT,
        visitedLocation,
    };
};