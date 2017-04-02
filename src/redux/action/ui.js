//@todo: like reducer -> control

export const FOLLOW_USER_SET = 'FOLLOW_USER_SET';
export const followUserSet = (value) => {
    return {
        type: FOLLOW_USER_SET,
        value,
    };
};