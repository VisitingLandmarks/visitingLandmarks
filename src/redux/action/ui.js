//@todo: like reducer -> control

export const DIALOG_OPEN = 'DIALOG_OPEN';
export const dialogOpen = (dialog) => {
    return {
        type: DIALOG_OPEN,
        dialog,
    };
};

export const DIALOG_CLOSE = 'DIALOG_CLOSE';
export const dialogClose = () => {
    return {
        type: DIALOG_CLOSE,
    };
};

export const FOLLOW_USER_SET = 'FOLLOW_USER_SET';
export const followUserSet = (value) => {
    return {
        type: FOLLOW_USER_SET,
        value,
    };
};