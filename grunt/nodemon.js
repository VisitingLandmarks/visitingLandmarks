module.exports = function (grunt) {

    grunt.config('nodemon', {
        build: {
            script: 'server.js',
            options: {
                // nodeArgs: ['--inspect'],
                ext: 'js,json,handlebars',
                delay: 1000,
                ignore: [
                    'node_modules/**/*',
                    'static/**/*',
                    'test/**/*',
                ],
            },
        },
    });

    grunt.loadNpmTasks('grunt-nodemon');
};