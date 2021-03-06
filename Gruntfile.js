require('babel-register');
process.traceDeprecation = true;

module.exports = function (grunt) {
    // Load per-task config from separate files in folder '/grunt'.
    grunt.loadTasks('grunt');

    // QA
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('test', ['continue:on', 'hint', 'unit', 'continue:off']);

    // Build
    grunt.registerTask('git', ['githash', 'json_generator']);
    grunt.registerTask('build:dev', ['webpack:dev']);
    grunt.registerTask('build:prod', ['webpack:build']);

    // migration
    grunt.registerTask('migrate', ['execute:migration']);

    // target for production after deployment
    grunt.registerTask('postinstall', ['copy:build', 'build:prod']);

    // dev -> monitor changes and restart
    grunt.registerTask('monitor', ['nodemon:build']);
    // dev -> build and monitor parallel for local development without a docker container
    grunt.registerTask('startDev', ['migrate', 'git', 'concurrent:buildAndRun']);

    // default -> test
    grunt.registerTask('default', ['test', 'watch:test']);
};
