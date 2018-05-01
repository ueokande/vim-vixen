import actions from '../actions';
import * as tabs from 'background/tabs';
import * as parsers from 'shared/commands/parsers';
import * as properties from 'shared/settings/properties';

const openCommand = (url) => {
  return browser.tabs.query({
    active: true, currentWindow: true
  }).then((gotTabs) => {
    if (gotTabs.length > 0) {
      return browser.tabs.update(gotTabs[0].id, { url: url });
    }
  });
};

const tabopenCommand = (url) => {
  return browser.tabs.create({ url: url });
};

const winopenCommand = (url) => {
  return browser.windows.create({ url });
};

const bufferCommand = (keywords) => {
  if (keywords.length === 0) {
    return Promise.resolve([]);
  }
  let keywordsStr = keywords.join(' ');
  return browser.tabs.query({
    active: true, currentWindow: true
  }).then((gotTabs) => {
    if (gotTabs.length > 0) {
      if (isNaN(keywordsStr)) {
        return tabs.selectByKeyword(gotTabs[0], keywordsStr);
      }
      let index = parseInt(keywordsStr, 10) - 1;
      return tabs.selectAt(index);
    }
  });
};

const setCommand = (args) => {
  if (!args[0]) {
    return Promise.resolve();
  }

  let [name, value] = parsers.parseSetOption(args[0], properties.types);
  return {
    type: actions.SETTING_SET_PROPERTY,
    name,
    value
  };
};

const exec = (line, settings) => {
  let [name, args] = parsers.parseCommandLine(line);

  switch (name) {
  case 'o':
  case 'open':
    return openCommand(parsers.normalizeUrl(args, settings.search));
  case 't':
  case 'tabopen':
    return tabopenCommand(parsers.normalizeUrl(args, settings.search));
  case 'w':
  case 'winopen':
    return winopenCommand(parsers.normalizeUrl(args, settings.search));
  case 'b':
  case 'buffer':
    return bufferCommand(args);
  case 'set':
    return setCommand(args);
  case '':
    return Promise.resolve();
  }
  throw new Error(name + ' command is not defined');
};

export { exec };
