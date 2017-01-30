const util = require('util');

const NotAuthorizedError = function (message) {
    Error.call(this);
    this.message = message;
};
util.inherits(NotAuthorizedError, Error);

const BadRequestError = function (message) {
    Error.call(this);
    this.message = message;
};
util.inherits(BadRequestError, Error);

import Ajv from 'ajv';
const ajv = new Ajv({
    allErrors: true,
});


/**
 * a factory that creates a schema specific post middleware
 * @param schema a JSON schema
 * @returns {function(*, *, *)}
 */
export const postFactory = (schema) => {
    return (req, res, next) => {

        const isValid = ajv.validate(schema, req.body);
        req.log.debug({schema, isValid, body: req.body}, 'validating Input');

        if (isValid) {
            // validation is fine -> go on!
            next();
            return;
        }

        // validation failed
        next(new BadRequestError(ajv.errors && ajv.errors[0].dataPath.substring(1)));
    };
};




/**
 * combines n schemas (either as array or arguments into one schema)
 * @param baseSchema (optional/Array)
 */
export const combineSchema = function (baseSchema) {
    const args = Array.isArray(baseSchema) && baseSchema || Array.prototype.slice.call(arguments);
    return args.reduce(combineTwoSchema);
};


/**
 * combines two schemas into one
 * @param baseSchema
 * @param extension
 * @returns {{properties: {}, required: (Array|Array.<*>)}}
 */

const combineTwoSchema = (baseSchema, extension) => {
    return {
        ...baseSchema,
        ...extension,
        properties: {
            ...baseSchema.properties || {},
            ...extension.properties || {},
        },
        required: [
            ...baseSchema.required || [],
            ...extension.required || [],
        ].filter(isFirstOccurance), // elements in required should be unique
    };
};

export const buildBaseSchema = (title = 'Schema', additionalProperties = false) => {
    return {
        title,
        additionalProperties,
        type: 'object',
    };
};


/**
 * checks, if an element is the first occurrence in an array
 * @param value
 * @param index
 * @param arr
 * @returns {boolean}
 */
const isFirstOccurance = (value, index, arr) => {
    return arr.indexOf(value) === index;
};


/**
 * a factory that returns a schema specific ReduxForm Validator
 * @param schema
 * @returns {Function}
 */
export const reduxFormFactory = (schema) => {
    return (values) => {
        return validateInput(values, schema);
    };
};


/**
 * Validate a given input object against a json schema
 *
 * Heads up: validating an input of type=email produces over-aggressive console warnings in Chrome
 * https://github.com/facebook/react/issues/7487
 *
 * @param input {Object} - a json object of data to validate
 * @param schema {Object} - the json schema to validate against
 * @returns {*}
 */
const validateInput = (input, schema) => {
    const isValid = ajv.validate(schema, input);
    const formErrors = {};

    if (!isValid) {
        ajv.errors.forEach(function (error) {
            const errorName = error.dataPath.substring(1) || error.params.missingProperty;

            if (formErrors[errorName]) {
                formErrors[errorName].push(errorName);
                return;
            }

            formErrors[errorName] = [errorName];
        });
    }

    return formErrors;
};