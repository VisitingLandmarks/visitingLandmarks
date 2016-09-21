export const type = 'SET_LOCATIONS';
export default (locations) => {
    return {
        type,
        locations
    };
};