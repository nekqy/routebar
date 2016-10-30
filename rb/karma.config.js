var webpackConfig = require('./webpack.config.js');
var webpack = require('karma-webpack');
webpackConfig.entry = {};

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        reporters: ['spec'],
        port: 9876,
        colors: false,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        autoWatchBatchDelay: 300,
        files: [
            'vendor/jquery-3.1.1.js',
            'tests/**/*.spec.js'
        ],
        preprocessors: {
            'js/**/*.js': ['webpack'],
            'tests/**/*.spec.js': ['webpack']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            webpack,
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-chrome-launcher'
        ]

    });
};
