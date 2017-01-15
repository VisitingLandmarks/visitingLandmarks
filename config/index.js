/**
 * builds config based on a public base.js and a private local.js
 */
export default module.exports = require('deepmerge').all(
    [
        require('./base.js'),
        requireIfExists('./local.js'),
        requireIfExists('./git.json')
    ]
);

function requireIfExists(name) {
    try {
        return require(name);
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return false;
        }
    }
}