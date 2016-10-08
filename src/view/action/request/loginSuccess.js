export const type = 'REQUEST_LOGIN_SUCCESS';
export default (user) => {
    return {
        type,
        user
    };
};