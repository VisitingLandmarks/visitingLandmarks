import nodemailer from 'nodemailer';
import logger from './helper/logger';
import config from '../config';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.email.smtpTransport);


/**
 * send email when a user confirmed his emailadress
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const sendConfirmedUser = (user) => {

    return transporter.sendMail({
        from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
        to: user.email,
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: '<b>Hello world ?</b>' // html body
    })
        .then((emailInfo)=> {
            logger.info({emailInfo, user}, 'email send');
            return emailInfo;
        })
        .catch((err) => {
            logger.error(err, 'failed to send email');
        });
};
