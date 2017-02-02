module.exports = function (grunt) {

    grunt.config('eslint', {
        options: {
            fix: true,
        },
        all: [
            'Gruntfile.js',
            'config',
            'grunt',
            'src',
            'test',
        ],
    });

    grunt.loadNpmTasks('grunt-eslint');
};