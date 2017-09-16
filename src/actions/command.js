import * as tabs from '../background/tabs';
import * as consoleActions from './console';

const normalizeUrl = (string) => {
  try {
    return new URL(string).href;
  } catch (e) {
    return 'http://' + string;
  }
};

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

const bufferCommand = (keywords) => {
  return browser.tabs.query({
    active: true, currentWindow: true
  }).then((gotTabs) => {
    if (gotTabs.length > 0) {
      if (isNaN(keywords)) {
        return tabs.selectByKeyword(gotTabs[0], keywords);
      }
      let index = parseInt(keywords, 10) - 1;
      return tabs.selectAt(index);
    }
  });
};

const doCommand = (name, remaining) => {
  switch (name) {
  case 'open':
    // TODO use search engined and pass keywords to them
    return openCommand(normalizeUrl(remaining));
  case 'tabopen':
    return tabopenCommand(normalizeUrl(remaining));
  case 'b':
  case 'buffer':
    return bufferCommand(remaining);
  }
  throw new Error(name + ' command is not defined');
};

const getCompletions = (command, keywords) => {
  switch (command) {
  case 'buffer':
    return tabs.getCompletions(keywords).then((gotTabs) => {
      let items = gotTabs.map((tab) => {
        return {
          caption: tab.title,
          content: tab.title,
          url: tab.url,
          icon: tab.favIconUrl
        };
      });
      return [
        {
          name: 'Buffers',
          items: items
        }
      ];
    });
  }
  return Promise.resolve([]);
};

const exec = (line) => {
  let name = line.split(' ')[0];
  let remaining = line.replace(name + ' ', '');
  return doCommand(name, remaining).then(() => {
    return consoleActions.hide();
  });
};

const complete = (line) => {
  let command = line.split(' ', 1)[0];
  let keywords = line.replace(command + ' ', '');
  return getCompletions(command, keywords).then(consoleActions.setCompletions);
};

export { exec, complete };
