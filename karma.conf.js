module.exports = function (config) {

  var webpackConfig = require('./webpack.config.js');

  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    files: [
      'test/main.js',
      'test/**/*.test.js',
      'test/**/*.test.jsx',
      'test/**/*.html'
    ],

    preprocessors: {
      'test/main.js': [ 'webpack', 'sourcemap' ],
      'test/**/*.test.js': [ 'webpack', 'sourcemap' ],
      'test/**/*.test.jsx': [ 'webpack', 'sourcemap' ],
      'test/**/*.html': ['html2js']
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['FirefoxHeadless'],

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
