module.exports = function (config) {

  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'karma-delay.js',
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

    reporters: ['mocha'],

    plugins: [
      require('./karma-webext-launcher'),
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
    ],

    client: {
      mocha: {
        timeout: 5000
      }
    }
  })
}
