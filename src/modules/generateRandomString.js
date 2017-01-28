const crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
export default module.exports = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
