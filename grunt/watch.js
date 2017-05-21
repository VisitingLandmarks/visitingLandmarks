module.exports = (grunt) => {
    grunt.config('watch', {
        test: {
            options: {
                spawn: true,
            },
            files: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js',
            ],
            tasks: ['test'],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};
