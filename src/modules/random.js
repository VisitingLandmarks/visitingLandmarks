import crypto from 'crypto';

/**
 * generates random hex
 * @function
 * @param {number} length - Length of the random string.
 */
export default (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * generates random string of characters
 * @function
 * @param {number} length - Length of the random string.
 */
export const string = (length = 16, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') => {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};
