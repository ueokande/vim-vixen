import * as tabs from './tabs';
import * as histories from './histories';
import * as bookmarks from './bookmarks';

const getSearchCompletions = (command, keywords, searchConfig) => {
  let engineNames = Object.keys(searchConfig.engines);
  let engineItems = engineNames.filter(name => name.startsWith(keywords))
    .map(name => ({
      caption: name,
      content: command + ' ' + name
    }));
  return Promise.resolve(engineItems);
};

const getHistoryCompletions = async(command, keywords) => {
  let items = await histories.getCompletions(keywords);
  return items.map((page) => {
    return {
      caption: page.title,
      content: command + ' ' + page.url,
      url: page.url
    };
  });
};

const getBookmarksCompletions = async(command, keywords) => {
  let items = await bookmarks.getCompletions(keywords);
  return items.map(item => ({
    caption: item.title,
    content: command + ' ' + item.url,
    url: item.url,
  }));
};

const getOpenCompletions = async(command, keywords, searchConfig) => {
  let engineItems = await getSearchCompletions(command, keywords, searchConfig);
  let historyItems = await getHistoryCompletions(command, keywords);
  let bookmarkItems = await getBookmarksCompletions(command, keywords);
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
  if (bookmarkItems.length > 0) {
    completions.push({
      name: 'Bookmarks',
      items: bookmarkItems
    });
  }
  return completions;
};

const getBufferCompletions = async(command, keywords, excludePinned) => {
  let items = await tabs.getCompletions(keywords, excludePinned);
  items = items.map(tab => ({
    caption: tab.title,
    content: command + ' ' + tab.title,
    url: tab.url,
    icon: tab.favIconUrl
  }));
  return [
    {
      name: 'Buffers',
      items: items
    }
  ];
};

const getCompletions = (line, settings) => {
  let typedWords = line.trim().split(/ +/);
  let typing = '';
  if (!line.endsWith(' ')) {
    typing = typedWords.pop();
  }

  if (typedWords.length === 0) {
    return Promise.resolve([]);
  }
  let name = typedWords.shift();
  let keywords = typedWords.concat(typing).join(' ');

  switch (name) {
  case 'o':
  case 'open':
  case 't':
  case 'tabopen':
  case 'w':
  case 'winopen':
    return getOpenCompletions(name, keywords, settings.search);
  case 'b':
  case 'buffer':
    return getBufferCompletions(name, keywords, false);
  case 'bd!':
  case 'bdel!':
  case 'bdelete!':
  case 'bdeletes!':
    return getBufferCompletions(name, keywords, false);
  case 'bd':
  case 'bdel':
  case 'bdelete':
  case 'bdeletes':
    return getBufferCompletions(name, keywords, true);
  }
  return Promise.resolve([]);
};

const complete = (line, settings) => {
  return getCompletions(line, settings);
};

export { complete };
