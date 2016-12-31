"use strict";

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./build/webpack.dev.config.js');

const config = require("./config");

const PATHS = config.PATHS;
const ENVIRONMENT = config.ENVIRONMENT;
const CESIUM = config.CESIUM;

const app = express();
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
    /**
     * Webpack-dev-middleware config
     * Reference: https://webpack.github.io/docs/webpack-dev-middleware.html
     */

    publicPath: webpackConfig.output.publicPath,

    // Use preset option for Webpack stats display, which gives
    // nice colorized info without overly-large amounts of detail
    stats: "normal",
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use("/", express.static(PATHS.src));
app.use("/", express.static(PATHS.dll));
app.use("/cesium", express.static(CESIUM.debugBuildPath));

app.listen(ENVIRONMENT.port, ENVIRONMENT.host, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(`Listening at http://${ENVIRONMENT.host}:${ENVIRONMENT.port}`);
});

var catalog = require('./db');

app.get('/api/catalog', function (req, res) {
    res.json(catalog.videos)
})

app.post("/api/search", function (req, res) {
    res.json(catalog.videos)
});
