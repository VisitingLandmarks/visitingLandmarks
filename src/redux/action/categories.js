export const CATEGORIES_SET = 'CATEGORIES_SET';
export const categoriesSet = (categories) => {
    return {
        type: CATEGORIES_SET,
        categories
    };
};