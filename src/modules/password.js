import crypto from 'crypto';
import logger from './logger';
import generateRandomString from './generateRandomString';


/**
 * verifies a combination of plain password, passwordHash and salt
 * @param password
 * @param passwordHash
 * @param salt
 */
export const verify = (password, passwordHash, salt) => {
    return generate(password, salt).then((passwordData) => {
        if (passwordData.passwordHash !== passwordHash) {
            throw Error('incorrect password');
        }
    });
};


/**
 * generate a new hash
 * @param password
 * @param salt
 * @returns {Promise}
 */
export const generate = (password, passwordSalt = generateRandomString()) => {

    //ensure password is a string
    password = password.toString();

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, new Buffer(passwordSalt, 'binary'), 100000, 512, 'sha512', (err, key) => { // eslint-disable-line no-undef
            if (err) {
                logger.error('error during generation of Hash');
                return reject(err);
            }
            resolve({
                passwordHash: key.toString('hex'),
                passwordSalt: passwordSalt.toString('hex'),
            });
        });
    });

};
