/**
 * builds config based on a public base.js and a private local.js
 */
export default require('deepmerge').all(
    [
        require('./base'),
        requireIfExists('./local'),
        requireIfExists('./git.json'),
    ]
);

function requireIfExists (name) {
    try {
        return require(name);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return false;
        }
    }
}
