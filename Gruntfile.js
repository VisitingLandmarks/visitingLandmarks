module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');

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

                //storeStatsTo: "xyz", // writes the status to a variable named xyz
                // you may use it later in grunt i.e. <%= xyz.hash %>

                progress: true, // Don't show progress
                // Defaults to true

                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: true, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: true // don't finish the grunt task
                // Use this in combination with the watch option

                //inline: true,  // embed the webpack-dev-server runtime into the bundle
                // Defaults to false

                //hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
                // Use this in combination with the inline option

            }
        }
    });


    grunt.registerTask('postinstall', ['webpack']);
    grunt.registerTask('unit', ['mochaTest:build']);
    grunt.registerTask('monitor', ['nodemon:build']);
    grunt.registerTask('hint', ['eslint']);
    grunt.registerTask('all', ['hint', 'unit']);
    grunt.registerTask('default', ['all']);
};