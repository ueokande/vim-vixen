import * as tabs from 'background/tabs';
import * as histories from 'background/histories';

const normalizeUrl = (string, searchConfig) => {
  try {
    return new URL(string).href;
  } catch (e) {
    if (string.includes('.') && !string.includes(' ')) {
      return 'http://' + string;
    }
    let query = encodeURI(string);
    let template = searchConfig.engines[
      searchConfig.default
    ];
    for (let key in searchConfig.engines) {
      if (string.startsWith(key + ' ')) {
        query = encodeURI(string.replace(key + ' ', ''));
        template = searchConfig.engines[key];
      }
    }
    return template.replace('{}', query);
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

const winopenCommand = (url) => {
  return browser.windows.create({ url });
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

const getOpenCompletions = (command, keywords, searchConfig) => {
  return histories.getCompletions(keywords).then((pages) => {
    let historyItems = pages.map((page) => {
      return {
        caption: page.title,
        content: command + ' ' + page.url,
        url: page.url
      };
    });
    let engineNames = Object.keys(searchConfig.engines);
    let engineItems = engineNames.filter(name => name.startsWith(keywords))
      .map(name => ({
        caption: name,
        content: command + ' ' + name
      }));

    let completions = [];
    if (engineItems.length > 0) {
      completions.push({
        name: 'Search Engines',
        items: engineItems
      });
    }
    if (historyItems.length > 0) {
      completions.push({
        name: 'History',
        items: historyItems
      });
    }
    return completions;
  });
};

const doCommand = (name, remaining, settings) => {
  switch (name) {
  case 'o':
  case 'open':
    return openCommand(normalizeUrl(remaining, settings.search));
  case 't':
  case 'tabopen':
    return tabopenCommand(normalizeUrl(remaining, settings.search));
  case 'w':
  case 'winopen':
    return winopenCommand(normalizeUrl(remaining, settings.search));
  case 'b':
  case 'buffer':
    return bufferCommand(remaining);
  }
  throw new Error(name + ' command is not defined');
};

const getCompletions = (command, keywords, settings) => {
  switch (command) {
  case 'o':
  case 'open':
  case 't':
  case 'tabopen':
  case 'w':
  case 'winopen':
    return getOpenCompletions(command, keywords, settings.search);
  case 'b':
  case 'buffer':
    return tabs.getCompletions(keywords).then((gotTabs) => {
      let items = gotTabs.map((tab) => {
        return {
          caption: tab.title,
          content: command + ' ' + tab.title,
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

const exec = (line, settings) => {
  let name = line.split(' ')[0];
  let remaining = line.replace(name + ' ', '');
  return doCommand(name, remaining, settings);
};

const complete = (line, settings) => {
  let command = line.split(' ', 1)[0];
  let keywords = line.replace(command + ' ', '');
  return getCompletions(command, keywords, settings);
};

export { exec, complete };
