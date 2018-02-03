'use strict'

var fs = require('fs')
var path = require('path')

var PREFS = {
  'browser.shell.checkDefaultBrowser': 'false',
  'browser.bookmarks.restore_default_bookmarks': 'false',
  'dom.disable_open_during_load': 'false',
  'dom.max_script_run_time': '0',
  'dom.min_background_timeout_value': '10',
  'extensions.autoDisableScopes': '0',
  'extensions.enabledScopes': '15',
}

var FirefoxWebExt = function (id, baseBrowserDecorator, args) {
  baseBrowserDecorator(this)

  this._start = function (url) {
    var self = this
    var command = this._getCommand()

    let prefArgs = [].concat(...Object.keys(PREFS).map((key) => {
      return ['--pref', key + '=' + PREFS[key]];
    }));
    let sourceDirArgs = [].concat(...args.sourceDirs.map((dir) => {
      return ['--source-dir', dir];
    }));

    self._execCommand(
      command,
      ['run', '--start-url', url, '--no-input'].concat(sourceDirArgs, prefArgs)
    )
  }
}

FirefoxWebExt.prototype = {
  name: 'FirefoxWebExt',

  DEFAULT_CMD: {
    linux: 'node_modules/web-ext/bin/web-ext',
    darwin: 'node_modules/web-ext/bin/web-ext',
    win32: 'node_modules/web-ext/bin/web-ext',
  }
}

FirefoxWebExt.$inject = ['id', 'baseBrowserDecorator', 'args']

// PUBLISH DI MODULE
module.exports = {
  'launcher:FirefoxWebExt': ['type', FirefoxWebExt],
}

