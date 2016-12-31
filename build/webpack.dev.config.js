"use strict";

const path = require("path")
const webpack = require('webpack')
const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require("../config");
const webpackBaseConfig = require("./webpack.base.config");

const PATHS = config.PATHS;
const ENVIRONMENT = config.ENVIRONMENT;

// In development mode, add several additional plugins to Babel
const devBabelLoader = Object.assign({}, webpackBaseConfig.baseBabelLoader, {
    query: {
        cacheDirectory: true,
        env: {
            development: {
                // Add the plugins for Hot Module Reloading support
                presets: ["react-hmre"],
                plugins: [
                    ["react-transform", {
                        transforms: [{
                            // Also add support for the per-component render visualizer plugin
                            transform: "react-transform-render-visualizer/lib/specify"
                        }]
                    }]
                ]
            }
        }
    }
})

module.exports = merge.smart(webpackBaseConfig.baseWebpackConfig, {
    entry: {
        app: [
            // Hook up the hot-reloading middleware so it can be notified a bundle has been rebuilt
            'webpack-hot-middleware/client',
            PATHS.src + "/index.js"
        ]
    },

    module: {
        loaders: [
            devBabelLoader,
            webpackBaseConfig.baseImageLoaders,
            { test: /\.css$/, loader: 'style!css?modules', include: /flexboxgrid/ },
            { test: /\.css$/, loader: "style-loader!css-loader", exclude: /flexboxgrid/ },
        ],

        noParse: [
        ]
    },

    resolve: {
        alias: {
        }
    },

    plugins: [
        // Force more consistent build hashes
        new webpack.optimize.OccurenceOrderPlugin(),

        // The "standard" file watching support sucks up 20-25% CPU when running
        // on Windows, possibly because it's watching /node_modules/.  Using this
        // appears to give the same fast change detection, with minimal CPU usage.
        new webpack.OldWatchingPlugin(),

        /**
         * This is where the magic happens! You need this to enable Hot Module Replacement!
         */
        new webpack.HotModuleReplacementPlugin(),

        /**
         * NoErrorsPlugin prevents your webpack CLI from exiting with an error code if
         * there are errors during compiling - essentially, assets that include errors
         * will not be emitted. If you want your webpack to 'fail', you need to check out
         * the bail option.
         */
        new webpack.NoErrorsPlugin(),

        new webpack.DllReferencePlugin({
            context: ".",
            manifest: require(path.join(PATHS.dll, "/vendor-manifest.json")),
        }),

        new webpack.DllReferencePlugin({
            scope: "cesium",
            manifest: require(path.join(PATHS.dll, "/cesium-manifest.json")),
        }),

        /**
         * DefinePlugin allows us to define free variables, in any webpack build, you can
         * use it to create separate builds with debug logging or adding global constants!
         * Here, we use it to specify a development build.
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),

        webpackBaseConfig.htmlPlugin
    ],

    // Generate sourcemaps using a faster method
    devtool: 'source-map'
})
