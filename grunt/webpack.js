const webpack = require('webpack');
module.exports = function (grunt) {

    const shared = {
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
                        presets: ['react', 'es2017'],
                        plugins: ['transform-runtime', 'transform-object-rest-spread']
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                }
            })
        ],
        stats: {
            colors: false,
            modules: false,
            reasons: true
        }
    };


    grunt.config('webpack', {
        build: {
            ...shared,
            plugins: [...shared.plugins,
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            ],
            progress: false,
            failOnError: true,
            watch: false,
            keepalive: false
        },

        dev: {
            ...shared,
            devtool: '#inline-source-map',
            progress: true,
            failOnError: false,
            watch: true,
            keepalive: true
        }
    });

    grunt.loadNpmTasks('grunt-webpack');
};