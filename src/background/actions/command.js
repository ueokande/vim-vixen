import actions from '../actions';
import * as consoleActions from './console';
import * as tabs from '../shared/tabs';
import * as bookmarks from '../shared/bookmarks';
import * as parsers from 'background/shared/commands/parsers';
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
    return;
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
    return { type: '' };
  }
  let item = await bookmarks.create(args.join(' '), tab.url);
  if (!item) {
    return consoleActions.error(tab, 'Could not create a bookmark');
  }
  return consoleActions.info(tab, 'Saved current page: ' + item.url);
};

const setCommand = (args) => {
  if (!args[0]) {
    return { type: '' };
  }

  let [name, value] = parsers.parseSetOption(args[0], properties.types);
  return {
    type: actions.SETTING_SET_PROPERTY,
    name,
    value
  };
};

// eslint-disable-next-line complexity, max-lines-per-function
const doExec = async(tab, line, settings) => {
  let [name, args] = parsers.parseCommandLine(line);

  switch (name) {
  case 'o':
  case 'open':
    await openCommand(parsers.normalizeUrl(args, settings.search));
    break;
  case 't':
  case 'tabopen':
    await tabopenCommand(parsers.normalizeUrl(args, settings.search));
    break;
  case 'w':
  case 'winopen':
    await winopenCommand(parsers.normalizeUrl(args, settings.search));
    break;
  case 'b':
  case 'buffer':
    await bufferCommand(args);
    break;
  case 'bd':
  case 'bdel':
  case 'bdelete':
    await tabs.closeTabByKeywords(args.join(' '));
    break;
  case 'bd!':
  case 'bdel!':
  case 'bdelete!':
    await tabs.closeTabByKeywordsForce(args.join(' '));
    break;
  case 'bdeletes':
    await tabs.closeTabsByKeywords(args.join(' '));
    break;
  case 'bdeletes!':
    await tabs.closeTabsByKeywordsForce(args.join(' '));
    break;
  case 'addbookmark':
    return addbookmarkCommand(tab, args);
  case 'set':
    return setCommand(args);
  case 'q':
  case 'quit':
    await tabcloseCommand();
    break;
  case 'qa':
  case 'quitall':
    await tabcloseAllCommand();
    break;
  default:
    return consoleActions.error(tab, name + ' command is not defined');
  }
  return { type: '' };
};

// eslint-disable-next-line complexity
const exec = async(tab, line, settings) => {
  try {
    let action = await doExec(tab, line, settings);
    return action;
  } catch (e) {
    return consoleActions.error(tab, e.toString());
  }
};

export { exec };
