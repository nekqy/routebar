var webpack = require("webpack"),
    NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    entry: {
        main: "./js/main"
    },
    output: {
        path: __dirname + "/dist",
        filename: "rb.js",
        library: 'rb'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    resolve: { // как ищутся модули
        modulesDirectories: [ // если путь неотносительный, где искать
            './js/',
            './vendor/',
            './node_modules/'
        ]
    },
    devtool: NODE_ENV == 'development' ? 'source-map' : null,

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ]
};