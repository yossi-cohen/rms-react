"use strict";

const path = require("path");

const projectBasePath = path.resolve(__dirname);

const cesiumModuleFolder = "node_modules/cesium/";
const cesiumBuildFolder = path.join(cesiumModuleFolder, "/Build/");
const cesiumSourceFolder = path.join(cesiumModuleFolder, "/Source/");

const cesiumDebugName = "/CesiumUnminified/";
const cesiumProdName = "/Cesium/";

const cesiumDebugFolder = path.join(cesiumBuildFolder, cesiumDebugName);
const cesiumProdFolder = path.join(cesiumBuildFolder, cesiumProdName);

const localCesiumDebugPath = path.join(projectBasePath, cesiumDebugFolder);
const localCesiumProdPath = path.join(projectBasePath, cesiumProdFolder);

const localCesiumSourcePath = path.join(projectBasePath, cesiumSourceFolder);

const config = {
    env: process.env.NODE_ENV,

    PATHS: {
        base: projectBasePath,
        src: path.resolve(projectBasePath, 'src'),
        dist: path.resolve(projectBasePath, 'public'),
        dll: path.resolve(projectBasePath, 'dll')
    },

    ENVIRONMENT : {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3333
    }, 

    CESIUM: {
        moduleFolder: cesiumModuleFolder,
        buildFolder: cesiumBuildFolder,
        sourceFolder: cesiumSourceFolder,
        debugBuildPath: localCesiumDebugPath,
        prodBuildPath: localCesiumProdPath,
        sourcePath: localCesiumSourcePath
    }
};

config.BASE_URL = 'http://' + config.ENVIRONMENT.host + ':' + config.ENVIRONMENT.port;

let isDev = config.env === 'development';
let isProd = config.env === 'production';
let isTest = config.env === 'test';

config.globals = {
    'process.env'  : {
        'NODE_ENV' : JSON.stringify(isDev ? "development" : "production")
    },
    'NODE_ENV'     : config.env,
    '__DEV__'      : isDev,
    '__PROD__'     : isProd,
    '__TEST__'     : isTest
}

module.exports = config;
