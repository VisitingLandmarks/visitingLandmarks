export const type = 'VISITED_LOCATION';
export default (locationIds) => {

    if (!Array.isArray(locationIds)) {
        locationIds = [locationIds];
    }

    return {
        type,
        locationIds
    };
};