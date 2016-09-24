module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        mochaTest: {
            build: {
                src: ['test/unit/**/*.js'],
                options: {
                    reporter: 'spec',
                    checkLeaks: true,
                    ignoreLeaks: false,
                    require: ['test/setup.js', 'babel-core/register']
                }
            }
        },
        eslint: {
            options: {},
            target: ['Gruntfile.js', 'src']
        },
        nodemon: {
            build: {
                script: 'server.js',
                options: {
                    ext: 'js,jsx',
                    delay: 2000,
                    ignore: ['node_modules/**']
                }
            }
        },
        copy: {
            build: {
                files: [
                    {src: 'config/envToConfig.js', dest: 'config/local.js'}
                ]
            }
        },
        webpack: {
            build: {
                // webpack options
                entry: './src/view/main.jsx',
                output: {
                    path: './static/',
                    filename: 'all.js'
                },
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['es2015', 'react']
                            }
                        }
                    ]
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: false,
                    reasons: true
                },
                // stats: false disables the stats output

                progress: false, // Don't show progress

                failOnError: true, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: false, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: false // don't finish the grunt task
                // Use this in combination with the watch option

            },

            dev: {
                // webpack options
                entry: './src/view/main.jsx',
                output: {
                    path: './static/',
                    filename: 'all.js'
                },
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['es2015', 'react']
                            }
                        }
                    ]
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: false,
                    reasons: true
                },

                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: true, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: true // don't finish the grunt task
                // Use this in combination with the watch option

            }
        }
    });


    grunt.registerTask('postinstall', ['copy:build', 'webpack:build']);
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('monitor', ['nodemon:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('all', ['hint', 'unit']);
    grunt.registerTask('default', ['all']);
};