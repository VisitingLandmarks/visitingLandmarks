module.exports = function (grunt) {

    grunt.config('eslint', {
        options: {
            fix: true
        },
        all: ['Gruntfile.js', 'src', 'test', 'grunt']
    });

    grunt.loadNpmTasks('grunt-eslint');
};