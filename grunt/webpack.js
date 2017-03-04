const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = function (grunt) {

    const shared = {
        entry: [
            './src/view/main.js',
            './src/style/main.scss',
            ],
        output: {
            path: './static/',
            filename: 'all.js',
        },
        module: {
            loaders: [
                {
                    test: /.js?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['react', 'latest'],
                        plugins: ['transform-runtime', 'transform-object-rest-spread'],
                    },
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', ExtractTextPlugin.extract('css!postcss!sass')],
                },
                {
                    test: /\.(png|gif)$/,
                    loader: 'url-loader',
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file?name=fonts/[name].[ext]',
                },
            ],
        },
        postcss: function () {
            return [autoprefixer({
                browsers: ['ie 9', 'last 3 versions'],
            })];
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                },
            }),
            new ExtractTextPlugin('style.css', {
                allChunks: true,
            }),
        ],
        stats: {
            colors: false,
            modules: false,
            reasons: true,
        },
    };


    grunt.config('webpack', {
        build: {
            ...shared,
            plugins: [...shared.plugins,
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                    },
                }),
            ],
            progress: false,
            failOnError: true,
            watch: false,
            keepalive: false,
        },

        dev: {
            ...shared,
            devtool: '#inline-source-map',
            progress: true,
            failOnError: false,
            watch: true,
            keepalive: true,
        },
    });

    grunt.loadNpmTasks('grunt-webpack');
};