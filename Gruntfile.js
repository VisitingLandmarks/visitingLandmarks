const webpack = require('webpack');
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-githash');
    grunt.loadNpmTasks('grunt-json-generator');


    grunt.initConfig({
        githash: {
            main: {
                options: {}
            }
        },
        json_generator: {
            build: {
                dest: './config/git.json',
                options: {
                    version: {
                        tag: '<%= githash.main.tag %>',
                        branch: '<%= githash.main.branch %>'
                    }
                }
            }
        },
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
        complexity: {
            generic: {
                src: ['src/**/*.js'],
                exclude: [],
                options: {
                    breakOnErrors: false,
                    errorsOnly: false,              // show only maintainability errors
                    cyclomatic: [7, 12],            // or optionally a single value, like 3
                    halstead: [13, 20],             // or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false,    // only display maintainability
                    broadcast: false                // broadcast data over event-bus
                }
            }
        },
        watch: {
            js: {
                options: {
                    spawn: true
                },
                files: [
                    'Gruntfile.js',
                    'src/**/*.js',
                    'src/**/*.jsx',
                    'test/**/*.js'
                ],
                tasks: ['all']
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
                    ext: 'js,jsx,json,handlebars',
                    delay: 1000,
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
                entry: './src/view/main.jsx',
                output: {
                    path: './static/',
                    filename: 'all.js'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    })
                ],
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['react', 'es2017'],
                                plugins: ['transform-runtime', 'transform-object-rest-spread']
                            }
                        }
                    ]
                },
                stats: {
                    colors: false,
                    modules: false,
                    reasons: true
                },
                progress: false,
                failOnError: true,
                watch: false,
                keepalive: false
            },

            dev: {
                entry: ['./src/view/main.jsx'],
                output: {
                    path: './static/',
                    filename: 'all.js'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                        }
                    })
                ],
                devtool: '#inline-source-map',
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['react', 'es2017'],
                                plugins: ['transform-runtime', 'transform-object-rest-spread']
                            }
                        }
                    ]
                },
                stats: {
                    colors: false,
                    modules: false,
                    reasons: true
                },
                progress: true,
                failOnError: false,
                watch: true,
                keepalive: true
            }
        }
    });

    //QA
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('test', ['hint', 'unit', 'complexity']);

    //Build
    grunt.registerTask('git', ['githash', 'json_generator']);
    // grunt.registerTask('postinstall', ['git', 'copy:build', 'webpack:build']);
    grunt.registerTask('postinstall', ['copy:build', 'webpack:build']);

    //Dev
    grunt.registerTask('monitor', ['nodemon:build']);

    //default
    grunt.registerTask('default', ['test']);
};