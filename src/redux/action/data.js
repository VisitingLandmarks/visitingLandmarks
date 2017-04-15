export const INTL_SET = 'INTL_SET';
export const intlSet = (intl) => {
    return {
        type: INTL_SET,
        intl,
    };
};