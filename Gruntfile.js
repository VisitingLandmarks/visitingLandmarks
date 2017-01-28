require('babel-register');

module.exports = function (grunt) {
    // Load per-task config from separate files in folder '/grunt'.
    grunt.loadTasks('grunt');

    //QA
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('test', ['continue:on', 'hint', 'unit', 'continue:off']);

    //Build
    grunt.registerTask('git', ['githash', 'json_generator']);
    grunt.registerTask('postinstall', ['copy:build', 'webpack:build']);

    //Dev
    grunt.registerTask('monitor', ['nodemon:build']);

    //default
    grunt.registerTask('default', ['test', 'watch']);
};