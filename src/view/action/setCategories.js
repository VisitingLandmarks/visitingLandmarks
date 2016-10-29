export const type = 'SET_CATEGORIES';
export default (categories) => {
    return {
        type,
        categories
    };
};