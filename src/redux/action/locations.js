export const LOCATIONS_SET = 'LOCATIONS_SET';
export const locationsSet = (locations) => {
    return {
        type: LOCATIONS_SET,
        locations,
    };
};
