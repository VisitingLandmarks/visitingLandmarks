import crypto from 'crypto';
import config from '../../config';
import logger from './logger';
import randomHex, {string as randomString} from './random';
import {Buffer} from 'buffer';

/**
 * verifies a combination of plain password, passwordHash and passwordSalt
 * @param password
 * @param passwordHash
 * @param passwordSalt - the salt stored with the user
 */
export const verify = (password, passwordHash, passwordSalt) => {
    return generate(password, passwordSalt).then((passwordData) => {
        if (passwordData.passwordHash !== passwordHash) {
            throw Error('incorrect password');
        }
    });
};

/**
 * generate a new hash
 * @param password
 * @param passwordSalt - the salt stored with the user
 * @returns {Promise}
 */
export const generate = (password = randomString(), passwordSalt = randomHex()) => {
    // ensure password is a string, otherwise the crypto will get crazy if the password is a pure number
    password = password.toString();
    passwordSalt = passwordSalt.toString();

    // combine application (config) and password salt (database)
    const salt = config.applicationSalt + passwordSalt;

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, Buffer.from(salt, 'hex'), 100000, 512, 'sha512', (err, hash) => {
            if (err) {
                logger.error('error during generation of Hash');
                return reject(err);
            }
            resolve({
                passwordHash: hash.toString('hex'),
                passwordSalt: passwordSalt,
            });
        });
    });
};
