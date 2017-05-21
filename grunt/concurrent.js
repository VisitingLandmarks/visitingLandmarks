module.exports = (grunt) => {
    grunt.config('concurrent', {
        buildAndRun: {
            tasks: [
                'build:dev',
                'monitor',
            ],
            options: {
                logConcurrentOutput: true,
            },
        },
    });

    grunt.loadNpmTasks('grunt-concurrent');
};
