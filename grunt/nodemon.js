module.exports = function (grunt) {

    grunt.config('nodemon', {
        build: {
            script: 'server.js',
            options: {
                ext: 'js,jsx,json,handlebars',
                delay: 500,
                ignore: ['node_modules/**']
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
};