var webpack = require("webpack"),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    NODE_ENV = process.env.NODE_ENV || 'development';

var postLoaders = [];
if (NODE_ENV === 'test') {
    postLoaders.push({
        test: /\.js$/,
        exclude: /(test|node_modules)\//,
        loader: 'istanbul-instrumenter-loader'
    });
}

module.exports = {
    entry: "./js/main",
    output: {
        path: __dirname + "/dist",
        filename: (NODE_ENV === "production" ? "rb.min.js" : "rb.js"),
        library: 'rb'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: "css-loader?importLoaders=1!postcss-loader!sass-loader"
                    })
            }
        ].concat(postLoaders)
    },
    resolve: {
        modules: [
            './js/',
            './vendor/',
            './node_modules/'
        ]
    },
    devtool: NODE_ENV == 'development' || NODE_ENV == 'test' ? 'source-map' : false,

    plugins: [
        new ExtractTextPlugin('rb.css'),
        new webpack.NoErrorsPlugin()
    ]
};