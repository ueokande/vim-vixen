module.exports = function (config) {

  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      '**/*.test.js'
    ],

    preprocessors: {
      '**/*.test.js': ['webpack']
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    customLaunchers: {
      FirefoxWebExtRunner: {
        base: 'FirefoxWebExt',
        sourceDirs: [ '.', 'e2e/ambassador'],
      },
    },
    browsers: ['FirefoxWebExtRunner'],
    sauceLabs: {
      username: 'michael_jackson'
    },

    singleRun: true,

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('./karma-webext-launcher'),
      'karma-mocha',
      'karma-webpack',
    ],
  })
}
