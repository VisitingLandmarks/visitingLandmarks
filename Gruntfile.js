const webpack = require("webpack");
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
                    ext: 'js,jsx,handlebars',
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
                        'process.env.NODE_ENV': '"production"'
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
                                plugins: ['transform-runtime']
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
                devtool: "#inline-source-map",
                module: {
                    loaders: [
                        {
                            test: /.jsx?$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['react', 'es2017'],
                                plugins: ['transform-runtime']
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


    grunt.registerTask('postinstall', ['copy:build', 'webpack:build']);
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('monitor', ['nodemon:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('all', ['hint', 'unit']);
    grunt.registerTask('default', ['all']);
};