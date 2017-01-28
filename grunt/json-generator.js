module.exports = function (grunt) {

    grunt.config('json_generator', {
        build: {
            dest: './config/git.json',
            options: {
                version: {
                    tag: '<%= githash.main.tag %>',
                    branch: '<%= githash.main.branch %>',
                    short: '<%= githash.main.short %>',
                    hash: '<%= githash.main.hash %>'

                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-json-generator');
};