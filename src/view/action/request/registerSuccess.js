export const type = 'REQUEST_REGISTER_SUCCESS';
export default (user) => {
    return {
        type,
        user
    };
};