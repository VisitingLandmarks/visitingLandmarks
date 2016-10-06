import nodemailer from 'nodemailer';
import logger from '../helper/logger';
import config from '../../config';
const EmailTemplate = require('email-templates').EmailTemplate;
const sendUserRegisteredTemplateDir   = require('path').join(__dirname, 'template', 'sendUserRegistered');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.email.smtpTransport);

const sendUserRegisteredTemplate = transporter.templateSender(new EmailTemplate(sendUserRegisteredTemplateDir), {
    from: '"Visiting Landmarks" <info@visitinglandmarks.com>'
});

export const sendUserRegistered = (user) => {
    return sendUserRegisteredTemplate({
        to: user.email,
        subject: 'Welcome!'
    }, {user})
        .then((emailInfo)=> {
            logger.info({emailInfo, user}, 'UserRegistered email send');
            return emailInfo;
        })
        .catch((err) => {
            logger.error(err, 'failed to send UserRegistered email');
        });
};


/**
 * send email when a user confirmed his emailadress
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const sendUserConfirmed = (user) => {

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
