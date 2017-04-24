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
            'react-hot-loader/patch',
            // activate HMR for React

            'webpack-dev-server/client?http://localhost:8080',
            // bundle the client for webpack-dev-server
            // and connect to the provided endpoint

            'webpack/hot/only-dev-server',
            // bundle the client for hot reloading
            // only- means to only hot reload for successful updates

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
            publicPath: '/',    // necessary for HMR to know where to load the hot update chunks
            filename: 'all.js',
        },
        devServer: {
            hot: true,
            // enable HMR on the server

            contentBase: path.resolve(__dirname, '../static/'),
            // match the output path

            publicPath: '/',
            // match the output `publicPath`
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
            new webpack.HotModuleReplacementPlugin(),
            // enable HMR globally

            new webpack.NamedModulesPlugin(),
            // prints more readable module names in the browser console on HMR updates
        ],
        progress: false,
        stats: {
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
            failOnError: true,
            watch: false,
            keepalive: false,
            stats: {
                ...shared.stats,
                colors: false,
            },
        },

        dev: {
            ...shared,
            devtool: '#inline-source-map',
            failOnError: false,
            watch: true,
            keepalive: true,
        },
    });

    grunt.loadNpmTasks('grunt-webpack');
};