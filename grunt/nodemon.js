module.exports = (grunt) => {
    grunt.config('nodemon', {
        build: {
            script: 'server.js',
            options: {
                // nodeArgs: ['--inspect'],
                ext: 'js,json,handlebars',
                delay: 500,
                ignore: [
                    'node_modules/**/*',
                    'static/**/*',
                    'test/**/*',
                ],

                // Piping the output through the bunyan binary to have a human readable output during development.
                // Equivalent to "grunt nodemon | ./node_modules/.bin/bunyan"
                // taken from https://gist.github.com/ebourmalo/d3756bcd844c5eab7053
                stdout: false,
                callback: (nodemon) => {
                    nodemon.on('readable', function () {
                        const bunyan = grunt.util.spawn({
                            cmd: './node_modules/.bin/bunyan',
                            args: ['--output', 'short', '--color'],
                        }, () => {});

                        bunyan.stdout.pipe(process.stdout);
                        bunyan.stderr.pipe(process.stderr);

                        this.stdout.pipe(bunyan.stdin);
                        this.stderr.pipe(bunyan.stdin);
                    });
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-nodemon');
};
