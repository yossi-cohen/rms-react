module.exports = {
    devtool: 'source-map',
    context: __dirname,
    entry: './src/main.js',
    output: {
        filename: "bundle.js"
    },
    devServer: {
        inline: true,
        port: 3333
    },
    module: {
        // preLoaders: [
        //     {
        //         test: /\.js$/,
        //         exclude: /node_modules/,
        //         loader: 'jshint-loader'
        //     }
        // ],
        noParse: [],
        loaders: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-class-properties','transform-decorators-legacy']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
        ]
    },

    // resolve is a section which lets us specify what kind of file types we can process 
    // without specifically giving them a file extension.{ test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    // e.g., require('./logger'); instead of: require('./logger.es6');
    resolve: {
        modulesDirectories: ['node_modules'],
        alias: {},
        extensions: ['', '.jsx', '.js', '.es6']
    }
}
