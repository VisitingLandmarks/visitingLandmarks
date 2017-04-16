const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

const emptyShim = path.resolve(__dirname, './emptyShim.js');
const emptyShimModules = [
    'dtrace-provider',
    'fs',
    'mv',
    'safe-json-stringify',
    'source-map-support',
].reduce((obj, module) => {
    obj[module] = emptyShim;
    return obj;
}, {});

const secureConfigShim = path.resolve(__dirname, '../config/browser.js');
const secureConfigShimModules = [
    '../config',
    '../../config',
    '../../../config',
    '../../../../config',
    '../../../../../config',
    '../../../../../../config',
    '../../../../../../../config',
].reduce((obj, module) => {
    obj[module] = secureConfigShim;
    return obj;
}, {});

module.exports = function (grunt) {

    const shared = {
        entry: [
            './src/view/browserSide.js',
            './src/style/main.scss',
        ],
        resolve: {
            // These shims are needed for bunyan
            // and to ensure that no data is leaked
            alias: {
                ...emptyShimModules,
                ...secureConfigShimModules,
            },
        },
        output: {
            path: path.resolve(__dirname, '../static/'),
            filename: 'all.js',
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/i,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['react', 'latest'],
                        plugins: ['transform-runtime', 'transform-object-rest-spread'],
                    },
                },
                {
                    test: /\.(scss)$/i,
                    // using "loader" instead of newer "use"
                    loader: ExtractTextPlugin.extract({
                        loader: [
                            {
                                loader: 'css-loader',
                                query: {
                                    importLoaders: 1,
                                    minimize: false,
                                    sourceMap: true,
                                },
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [autoprefixer({
                                        browsers: ['ie 9', 'last 3 versions'],
                                    })],
                                },
                            },
                            {
                                loader: 'sass-loader',
                                query: {
                                    // Enable sourcemaps for resolve-url-loader to work properly
                                    sourceMap: true,
                                },
                            },
                        ],
                    }),
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
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                },
            }),
            new ExtractTextPlugin({
                filename: 'style.css',
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
}
;