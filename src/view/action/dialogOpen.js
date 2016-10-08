export const type = 'OPEN_DIALOG';
export default (dialog) => {
    return {
        type,
        dialog
    };
};