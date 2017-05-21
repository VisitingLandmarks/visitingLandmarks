if (typeof document !== 'undefined') {
    module.exports = function () {
    };
} else {
    module.exports = function (markup) {
        global.document = require('jsdom').jsdom(markup || '<html><body></body></html>');
        global.window = document.defaultView;
        global.navigator = {
            userAgent: 'node.js',
        };
        return global.window;
    };
}

    // module.exports = function (markup) {
    //     if (typeof document === 'undefined') {
    //
    //         const jsdom = require('jsdom').jsdom;
    //         global.document = jsdom(markup || '<html><body></body></html>');
    //         global.window = global.document.defaultView;
    //         global.navigator = {
    //             userAgent: 'node.js',
    //         };
    //         for (let key in global.window) {
    //             if (!global[key]) {
    //                 global[key] = global.window[key];
    //             }
    //         }
    //     }
    // };
