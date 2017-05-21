module.exports = (grunt) => {
    grunt.config('githash', {
        main: {
            options: {},
        },
    });

    grunt.loadNpmTasks('grunt-githash');
};
