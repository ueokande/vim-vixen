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

const getHistoryCompletions = (command, keywords) => {
  return histories.getCompletions(keywords).then((pages) => {
    return pages.map((page) => {
      return {
        caption: page.title,
        content: command + ' ' + page.url,
        url: page.url
      };
    });
  });
};

const getBookmarksCompletions = (command, keywords) => {
  return bookmarks.getCompletions(keywords).then((items) => {
    return items.map((item) => {
      return {
        caption: item.title,
        content: command + ' ' + item.url,
        url: item.url,
      };
    });
  });
};

const getOpenCompletions = (command, keywords, searchConfig) => {
  return Promise.all([
    getSearchCompletions(command, keywords, searchConfig),
    getHistoryCompletions(command, keywords),
    getBookmarksCompletions(command, keywords),
  ]).then(([engineItems, historyItems, bookmarkItems]) => {
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
  });
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
    return tabs.getCompletions(keywords).then((gotTabs) => {
      let items = gotTabs.map((tab) => {
        return {
          caption: tab.title,
          content: name + ' ' + tab.title,
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

const complete = (line, settings) => {
  return getCompletions(line, settings);
};

export { complete };
