export default (type) => {
    return (data) => {
        return {
            type,
            ...data,
        };
    };
};
