module.exports = {
    properties: {
        username: {
            type: 'string',
            format: 'email',
        },
    },
    required: ['username'],
};
