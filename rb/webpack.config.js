module.exports = {
    entry: "./js/main",
    output: {
        path: __dirname + "/dist",
        filename: "rb.js",
        library: 'rb'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};