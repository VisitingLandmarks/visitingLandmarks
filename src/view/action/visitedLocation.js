export const type = 'VISITED_LOCATION';
export default (visitedLocation) => {
    return {
        type,
        visitedLocation
    };
};