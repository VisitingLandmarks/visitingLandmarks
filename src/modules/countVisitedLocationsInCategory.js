/**
 * count the visited locations in a given category
 * @param categoryItems
 * @param visitedLocations
 * @returns {*}
 */
export default module.exports = (categoryItems, visitedLocations) => {
    return categoryItems.reduce((count, id) => {
        if (visitedLocations[id]) {
            count++;
        }
        return count;
    }, 0);
};
