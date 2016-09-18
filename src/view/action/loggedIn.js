export const type = 'LOGGED_IN';
export default (user) => {
    return {
        type,
        user
    };
};