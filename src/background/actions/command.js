import messages from 'shared/messages';
import actions from '../actions';
import * as tabs from '../shared/tabs';
import * as bookmarks from '../shared/bookmarks';
import * as parsers from 'shared/commands/parsers';
import * as properties from 'shared/settings/properties';

const openCommand = async(url) => {
  let got = await browser.tabs.query({
    active: true, currentWindow: true
  });
  if (got.length > 0) {
    return browser.tabs.update(got[0].id, { url: url });
  }
};

const tabopenCommand = (url) => {
  return browser.tabs.create({ url: url });
};

const tabcloseCommand = async() => {
  let got = await browser.tabs.query({
    active: true, currentWindow: true
  });
  return browser.tabs.remove(got.map(tab => tab.id));
};

const tabcloseAllCommand = () => {
  return browser.tabs.query({
    currentWindow: true
  }).then((tabList) => {
    return browser.tabs.remove(tabList.map(tab => tab.id));
  });
};

const winopenCommand = (url) => {
  return browser.windows.create({ url });
};

const bufferCommand = async(keywords) => {
  if (keywords.length === 0) {
    return Promise.resolve([]);
  }
  let keywordsStr = keywords.join(' ');
  let got = await browser.tabs.query({
    active: true, currentWindow: true
  });
  if (got.length === 0) {
    return;
  }
  if (isNaN(keywordsStr)) {
    return tabs.selectByKeyword(got[0], keywordsStr);
  }
  let index = parseInt(keywordsStr, 10) - 1;
  return tabs.selectAt(index);
};

const addbookmarkCommand = async(tab, args) => {
  if (!args[0]) {
    return;
  }
  let item = await bookmarks.create(args.join(' '), tab.url);
  if (!item) {
    return browser.tabs.sendMessage(tab.id, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: 'Could not create a bookmark',
    });
  }
  return browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_INFO,
    text: 'Saved current page: ' + item.url,
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

// eslint-disable-next-line complexity
const exec = (tab, line, settings) => {
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
  case 'bd':
  case 'bdel':
  case 'bdelete':
    return tabs.closeTabByKeywords(args.join(' '));
  case 'bd!':
  case 'bdel!':
  case 'bdelete!':
    return tabs.closeTabByKeywordsForce(args.join(' '));
  case 'bdeletes':
    return tabs.closeTabsByKeywords(args.join(' '));
  case 'bdeletes!':
    return tabs.closeTabsByKeywordsForce(args.join(' '));
  case 'addbookmark':
    return addbookmarkCommand(tab, args);
  case 'set':
    return setCommand(args);
  case 'q':
  case 'quit':
    return tabcloseCommand();
  case 'qa':
  case 'quitall':
    return tabcloseAllCommand()
  case '':
    return Promise.resolve();
  }
  throw new Error(name + ' command is not defined');
};

export { exec };
