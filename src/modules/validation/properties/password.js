module.exports = {
    properties: {
        password: {
            type: 'string',
            minLength: 8,
        },
    },
    required: ['password'],
};
