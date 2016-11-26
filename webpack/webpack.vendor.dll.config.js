"use strict";

const path = require("path");
const webpack = require("webpack");

const config = require("../config");
const webpackBaseConfig = require("./webpack.base.config");

const PATHS = config.PATHS;

module.exports = {
    entry: {
        vendor: webpackBaseConfig.baseDependencies,
    },
    devtool: "#source-map",
    output: {
        path: PATHS.dll,
        filename: "[name].dll.js",
        library: "[name]_lib",
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css?modules', include: /flexboxgrid/ },
        ],

        noParse: [
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(PATHS.dll, "[name]-manifest.json"),
            name: "[name]_lib",
        }),

        // Setting DefinePlugin affects React library size!
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
};
