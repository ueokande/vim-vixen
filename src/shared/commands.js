import * as tabs from 'background/tabs';
import * as histories from 'background/histories';

const normalizeUrl = (args, searchConfig) => {
  let concat = args.join(' ');
  try {
    return new URL(concat).href;
  } catch (e) {
    if (concat.includes('.') && !concat.includes(' ')) {
      return 'http://' + concat;
    }
    let query = encodeURI(concat);
    let template = searchConfig.engines[
      searchConfig.default
    ];
    for (let key in searchConfig.engines) {
      if (args[0] === key) {
        query = args.slice(1).join(' ');
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

const tabopenCommand = (url, background = false, adjacent = false) => {
  if (adjacent) {
    return browser.tabs.query({
      active: true, currentWindow: true
    }).then((gotTabs) => {
      return browser.tabs.create({
        url: url,
        active: !background,
        index: gotTabs[0].index + 1
      });
    });
  }
  return browser.tabs.create({ url: url, active: !background });
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

const doCommand = (line, settings) => {
  let words = line.trim().split(/ +/);
  let name = words.shift();

  switch (name) {
  case 'o':
  case 'open':
    return openCommand(normalizeUrl(words, settings.search));
  case 't':
  case 'tabopen':
    return tabopenCommand(
      normalizeUrl(words, settings.search), false, settings.openAdjacentTabs);
  case 'w':
  case 'winopen':
    return winopenCommand(normalizeUrl(words, settings.search));
  case 'b':
  case 'buffer':
    return bufferCommand(words);
  case '':
    return Promise.resolve();
  }
  throw new Error(name + ' command is not defined');
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

const exec = (line, settings) => {
  return doCommand(line, settings);
};

const complete = (line, settings) => {
  return getCompletions(line, settings);
};

export { exec, complete, tabopenCommand };
