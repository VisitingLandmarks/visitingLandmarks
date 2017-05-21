module.exports = (grunt) => {
    grunt.config('mochaTest', {
        options: {
            reporter: 'spec',
            checkLeaks: true,
            ignoreLeaks: false,
            clearRequireCache: true,
            require: ['test/setup'],
        },
        build: {
            src: './test/unit/**/*.js',
        },
    });

    grunt.loadNpmTasks('grunt-mocha-test');
};
