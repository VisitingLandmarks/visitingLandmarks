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

const webpackDevPort = 8888;
const webpackLocation = 'http://localhost:' + webpackDevPort;
const webpackAssetTarget = '/static/';
const webpackAssetTargetAbsolute = webpackLocation + webpackAssetTarget;
const fsPathAssetTarget = path.resolve(__dirname, `..${webpackAssetTarget}`);

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
            path: fsPathAssetTarget,
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
                'global.isBrowser': JSON.stringify(true),
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
            reasons: true,
        },
    };

    const devConfig = {
        ...shared,
        devtool: '#inline-source-map',
        failOnError: false,
        watch: true,
        keepalive: true,
    };

    grunt.config('webpack', {
        build: {
            ...shared,
            progress: false,
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

        dev: devConfig,
    });

    const devHMRConfig = {
        ...devConfig,
        entry: [
            // activate HMR for React
            'react-hot-loader/patch',

            // bundle the client for webpack-dev-server
            'webpack-dev-server/client?' + webpackLocation,

            // bundle the client for hot reloading
            // only- means to only hot reload for successful updates
            'webpack/hot/only-dev-server',

            ...devConfig.entry,
        ],
        output: {
            ...devConfig.output,

            // necessary for HMR to know where to load the hot update chunks
            publicPath: webpackAssetTargetAbsolute,
        },
        plugins: [
            ...devConfig.plugins,

            // enable HMR globally
            new webpack.HotModuleReplacementPlugin(),

            // prints more readable module names in the browser console on HMR updates
            new webpack.NamedModulesPlugin(),
        ],
    };

    grunt.config('webpack-dev-server', {
        options: {
            webpack: devHMRConfig,
            publicPath: webpackAssetTarget,
            port: webpackDevPort,
            hot: true,
            host: 'localhost',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
        dev: {}, //target - we need one, even if it is empty...
    });

    grunt.loadNpmTasks('grunt-webpack');
};