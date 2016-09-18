'use strict';
const crypto = require('crypto');
const logger = require('../logger.js');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = (length) =>
    crypto.randomBytes(length).toString('hex');


/**
 * verifies a combination of plain password, passwordHash and salt
 * @param password
 * @param passwordHash
 * @param salt
 */
export const verify = (password, passwordHash, salt) => {
    return generate(password, salt).then((passwordData) => {
        return passwordData.passwordHash === passwordHash;
    });
};


/**
 * generate a new hash
 * @param password
 * @param salt
 * @returns {Promise}
 */
export const generate = (password, passwordSalt = genRandomString(32)) => {

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, new Buffer(passwordSalt,'binary'), 100000, 512, 'sha512', (err, key) => { // eslint-disable-line no-undef
            if (err) {
                logger.error('error during generation of Hash');
                return reject(err);
            }
            resolve({
                passwordHash: key.toString('hex'),
                passwordSalt: passwordSalt.toString('hex')
            });
        });
    });

};
