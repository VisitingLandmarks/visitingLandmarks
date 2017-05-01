import crypto from 'crypto';

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
export default (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
