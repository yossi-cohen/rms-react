"use strict";

const path = require("path");

const projectBasePath = path.resolve(__dirname);

const config = {
    env: process.env.NODE_ENV,

    host: 'localhost',
    port: 3003,

    PATHS: {
        base: projectBasePath,
        src: path.resolve(projectBasePath, 'src'),
        dist: path.resolve(projectBasePath, 'public')
    }
};

module.exports = config;
