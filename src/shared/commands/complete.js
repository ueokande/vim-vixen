import * as tabs from 'background/tabs';
import * as histories from 'background/histories';

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

export default complete;
