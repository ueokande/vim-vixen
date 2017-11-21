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

const tabopenCommand = (url, flags) => {
  let args = { url };
  args.pinned = flags.includes('-p');
  args.active = !flags.includes('-b');
  return browser.tabs.create(args);
};

const winopenCommand = (url, flags) => {
  let args = { url };
  args.incognito = flags.includes('-i');
  return browser.windows.create(args);
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
  let words = [].concat(...line.split('"').map((v, i) => {
    return i % 2 ? v : v.split(' ');
  })).filter(Boolean);
  let command = words.shift();
  let flags = words.filter((elem) => {
    if (elem.match(/^-.$/)) {
      return elem;
    }
    return '';
  });
  let args = words.filter((elem) => {
    if (elem.match(/^(?!-)/)) {
      return elem;
    }
    return '';
  });

  switch (command) {
  case 'o':
  case 'open':
    return openCommand(normalizeUrl(args, settings.search));
  case 't':
  case 'tabopen':
    return tabopenCommand(normalizeUrl(args, settings.search), flags);
  case 'w':
  case 'winopen':
    return winopenCommand(normalizeUrl(args, settings.search), flags);
  case 'b':
  case 'buffer':
    return bufferCommand(args);
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

export { exec, complete };
