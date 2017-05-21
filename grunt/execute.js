module.exports = (grunt) => {
    grunt.config('execute', {
        migration: {
            src: ['./src/migration'],
        },
    });

    grunt.loadNpmTasks('grunt-execute');
};
