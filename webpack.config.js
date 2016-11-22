const path = require("path")

const config = require("./config")
const PATHS = config.PATHS;

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    context: __dirname,
    entry: './src/index.js',
    output: {
        filename: "bundle.js"
    },
    devServer: {
        contentBase: PATHS.src,
        noInfo: false,
        port: 3333
    },
    module: {
        loaders: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-class-properties', 'transform-decorators-legacy']
                }
            },
            { test: /\.css$/, loader: 'style!css?modules', include: /flexboxgrid/ },
            { test: /\.css$/, loader: "style-loader!css-loader", exclude: /flexboxgrid/ },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
            { test: /\.svg/, loader: 'svg-url-loader' }
        ]
    },

    plugins: [
        new ExtractTextPlugin('public/css/main.css', { allChunks: true })
    ],

    // resolve is a section which lets us specify what kind of file types we can process 
    // without specifically giving them a file extension.{ test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    // e.g., require('./logger'); instead of: require('./logger.es6');
    resolve: {
        root : PATHS.src,
        modulesDirectories: ['node_modules'],
        alias: {},
        extensions: ['', '.jsx', '.js', '.es6']
    }
}
