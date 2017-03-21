export default (type) => {
    return (...args) => {
        return {
            type,
            ...args,
        };
    };
};