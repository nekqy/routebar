var webpackConfig = require('./webpack.config.js');
var webpack = require('karma-webpack');

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        reporters: ['dots', 'progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        autoWatchBatchDelay: 300,
        files: [
            'tests/**/*.spec.js'
        ],
        preprocessors: {
            'tests/**/*.spec.js': ['webpack']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            webpack,
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-sourcemap-loader'
        ],
        // конфигурация репортов о покрытии кода тестами
        coverageReporter: {
            dir:'./docs/coverage/',
            reporters: [
                { type:'html', subdir: 'report-html' },
                { type:'lcov', subdir: 'report-lcov' }
            ],
            instrumenterOptions: {
                istanbul: { noCompact:true }
            },
            includeAllSources: true
        }
    });
};
