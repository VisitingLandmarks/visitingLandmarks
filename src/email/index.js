import nodemailer from 'nodemailer';
import logger from '../helper/logger';
import config from '../../config';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.email.smtpTransport);

//setting up email templates
const EmailTemplate = require('email-templates').EmailTemplate;

/**
 * preparing a email template
 * @param templateName string
 */
const prepareEmailTemplate = (templateName) => {
    return transporter.templateSender(new EmailTemplate(require('path').join(__dirname, 'template', templateName)), config.email.sendOptions);
};

//build object with template name as key and the prepared setup templates for nodemailer
const templates = ['userEmailConfirmed', 'userRegistered'].reduce((obj, templateName) => {
    obj[templateName] = prepareEmailTemplate(templateName);
    return obj;
}, {});


/**
 * extend the nodemailer promise with logging
 * @param promise
 * @param logger
 * @returns {Promise.<T>|Promise|Promise<R>|*}
 */
const addLogging = (promise, logger) => {
    return promise
        .then((emailInfo)=> {
            logger.info({emailInfo}, 'email send');
            return emailInfo;
        })
        .catch((err) => {
            logger.error(err, 'failed to send email');
        })
};


/**
 * send a email when a user registered his emailadress
 * @param user
 */
export const sendUserRegistered = (user) => {
    return addLogging(templates.userRegistered({
        to: user.email
    }, {user}), logger.child({template: 'userRegistered'}));
};


/**
 * send email when a user confirmed his emailadress
 * @param user
 * @returns {Promise|Promise.<T>}
 */
export const sendUserConfirmed = (user) => {
    return addLogging(templates.userEmailConfirmed({
        to: user.email
    }, {user}), logger.child({toEmail: user.email, template: 'userEmailConfirmed'}));
};