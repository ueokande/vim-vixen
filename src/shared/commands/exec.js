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
    let query = concat;
    let template = searchConfig.engines[
      searchConfig.default
    ];
    for (let key in searchConfig.engines) {
      if (args[0] === key) {
        query = args.slice(1).join(' ');
        template = searchConfig.engines[key];
      }
    }
    return template.replace('{}', encodeURIComponent(query));
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

const exec = (line, settings) => {
  let words = line.trim().split(/ +/);
  let name = words.shift();

  switch (name) {
  case 'o':
  case 'open':
    return openCommand(normalizeUrl(words, settings.search));
  case 't':
  case 'tabopen':
    return tabopenCommand(normalizeUrl(words, settings.search));
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

export default exec;
