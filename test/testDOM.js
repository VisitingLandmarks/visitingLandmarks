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