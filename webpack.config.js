const path = require("path")
var autoPrefixer = require('autoprefixer');
var HtmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

const config = require("./config")
const PATHS = config.PATHS;

webpackConfig = {
    context: __dirname,
    devtool: 'source-map',
    entry: {
        app: ['./src/index.js']
    },
    output: {
        filename: 'bundle.js',
        hash: false
    },
    module: {
        unknownContextCritical: false, // ignore Cesium related warnings
        loaders: [
            {
                test: [/\.js$/],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy']
                }
            },
            { test: /\.jsx$/, loader: 'babel-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: 'style!css?modules', include: /flexboxgrid/ },
            { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /flexboxgrid/ },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
            { test: /\.svg/, loader: 'svg-url-loader' }
        ]
    },
    postcss: [autoPrefixer()],
    plugins: [
        new ExtractTextPlugin('src/styles/main.css', { allChunks: true }),
        new HtmlPlugin({
            title: 'rms-ui',
            template: 'public/index.html',
            inject: 'true',
            chunks: ['app']
        })
    ],

    // resolve is a section which lets us specify what kind of file types we can process 
    // without specifically giving them a file extension.{ test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    // e.g., require('./logger'); instead of: require('./logger.es6');
    resolve: {
        root: PATHS.src,
        extensions: ['', '.jsx', '.js', '.es6'],
        modulesDirectories: ['node_modules'],
        alias: {}
    }
}

webpackConfig.entry.app.unshift('webpack/hot/only-dev-server');
webpackConfig.devServer = {
    port: 3333,
    contentBase: PATHS.dist,
    hot: true,
    noInfo: false
};

webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = webpackConfig;
