module.exports = function (grunt) {

    grunt.config('copy', {
        build: {
            files: [
                {src: 'config/envToConfig.js', dest: 'config/local.js'},
            ],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};
