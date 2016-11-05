/**
 * a wrapper that calls a function not more than the given interval and ensure that it get called with the last value after the interval
 */
export default module.exports = function (func, interval = 100) {
    let lastExecution = 0;
    let timeout;

    return function antiHammer() {

        clearTimeout(timeout);
        const now = Date.now();
        const distance = now - lastExecution;
        const args = arguments;

        if (distance < interval) {

            timeout = setTimeout(function () {
                antiHammer.apply(this, args);
            }, interval - distance + 1);

            return;
        }

        func.apply(this, args);
        lastExecution = now;
    };

};