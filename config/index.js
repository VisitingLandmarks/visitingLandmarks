/**
 * builds config based on a public base.js and a private local.js
 */
export default module.exports = require('deepmerge')(require('./base.js'), require('./local.js'));