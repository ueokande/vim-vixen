const path = require('path');

module.exports = function (config) {

  var webpackConfig = require('./webpack.config.js');

  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/main.ts',
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
      'test/**/*.html'
    ],

    preprocessors: {
      'test/main.ts': [ 'webpack', 'sourcemap' ],
      'test/**/*.test.ts': [ 'webpack', 'sourcemap' ],
      'test/**/*.test.tsx': [ 'webpack', 'sourcemap' ],
      'test/**/*.html': ['html2js']
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['FirefoxHeadless'],

    singleRun: true,

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        alias: {
          sinon: path.resolve(__dirname, 'node_modules/sinon/pkg/sinon.js'),
        },
        fallback: {
          // for webextensions-api-fake
          "url": false,
        },
        ...webpackConfig.resolve,
      },
      module: webpackConfig.module
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['mocha']
  })
}
