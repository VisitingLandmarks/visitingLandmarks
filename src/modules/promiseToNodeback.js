/**
 * wraps a promise for code that expect callback pattern
 * @param func
 * @returns {function(...[*])}
 */
export default (func) => {
    // func returns a promise and the caller expects a callback
    return (...args) => {
        const callback = args.pop();
        func(...args)
            .then((data) => callback(null, data))
            .catch((error) => callback(error, null));
    };
};
