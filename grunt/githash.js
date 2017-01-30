module.exports = function (grunt) {

    grunt.config('githash', {
        main: {
            options: {},
        },
    });

    grunt.loadNpmTasks('grunt-githash');
};