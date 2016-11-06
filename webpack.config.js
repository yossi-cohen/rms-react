module.exports = {
    devtool: 'source-map',
    entry: './main.js',
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
        loaders: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style!css!'
            }
        ]
    },

    // resolve is a section which lets us specify what kind of file types we can process 
    // without specifically giving them a file extension.
    // e.g., require('./logger'); instead of: require('./logger.es6');
    resolve: {
        extensions: ['', '.js', '.es6']
    }
}
