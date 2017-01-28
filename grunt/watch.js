module.exports = function (grunt) {

    grunt.config('watch', {
        js: {
            options: {
                spawn: true
            },
            files: [
                'Gruntfile.js',
                'src/**/*.js',
                'src/**/*.jsx',
                'test/**/*.js'
            ],
            tasks: ['test']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};