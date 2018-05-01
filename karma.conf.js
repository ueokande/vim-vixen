module.exports = function (config) {

  var webpackConfig = require('./webpack.config.js');

  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/**/*.test.js',
      'test/**/*.test.jsx',
      'test/**/*.html'
    ],

    preprocessors: {
      'test/**/*.test.js': [ 'webpack' ],
      'test/**/*.test.jsx': [ 'webpack' ],
      'test/**/*.html': ['html2js']
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Firefox'],

    singleRun: true,

    webpack: {
      devtool: 'inline-source-map',
      resolve: webpackConfig.resolve,
      module: webpackConfig.module
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['mocha']
  })
}
