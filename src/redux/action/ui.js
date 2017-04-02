//@todo: like reducer -> control
export const NAVIGATE_TO = 'NAVIGATE_TO';
export const navigateTo = (value) => {
    return {
        type: NAVIGATE_TO,
        value,
    };
};

export const FOLLOW_USER_SET = 'FOLLOW_USER_SET';
export const followUserSet = (value) => {
    return {
        type: FOLLOW_USER_SET,
        value,
    };
};