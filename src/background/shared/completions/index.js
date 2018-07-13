import commandDocs from 'shared/commands/docs';
import * as tabs from './tabs';
import * as histories from './histories';
import * as bookmarks from './bookmarks';
import * as properties from 'shared/settings/properties';

const completeCommands = (typing) => {
  let keys = Object.keys(commandDocs);
  return keys
    .filter(name => name.startsWith(typing))
    .map(name => ({
      caption: name,
      content: name,
      url: commandDocs[name],
    }));
};

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

const getSetCompletions = (command, keywords) => {
  let keys = Object.keys(properties.docs).filter(
    name => name.startsWith(keywords)
  );
  let items = keys.map((key) => {
    if (properties.types[key] === 'boolean') {
      return [
        {
          caption: key,
          content: command + ' ' + key,
          url: 'Enable ' + properties.docs[key],
        }, {
          caption: 'no' + key,
          content: command + ' no' + key,
          url: 'Disable ' + properties.docs[key],
        }
      ];
    }
    return [
      {
        caption: key,
        content: command + ' ' + key,
        url: 'Set ' + properties.docs[key],
      }
    ];
  }).flat();
  if (items.length === 0) {
    return Promise.resolve([]);
  }
  return Promise.resolve([
    {
      name: 'Properties',
      items,
    }
  ]);
};

const complete = (line, settings) => {
  let trimmed = line.trimStart();
  let words = trimmed.split(/ +/);
  let name = words[0];
  if (words.length === 1) {
    let items = completeCommands(name);
    if (items.length === 0) {
      return Promise.resolve([]);
    }
    return Promise.resolve([
      {
        name: 'Console Command',
        items: completeCommands(name),
      }
    ]);
  }
  let keywords = trimmed.slice(name.length).trimStart();

  switch (words[0]) {
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
  case 'set':
    return getSetCompletions(name, keywords);
  }
  return Promise.resolve([]);
};

export { complete };
