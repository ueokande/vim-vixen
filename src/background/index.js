import * as tabs from './tabs';
import KeyQueue from './key-queue';
import backgroundReducers from '../reducers/background';

const queue = new KeyQueue();

const keyPressHandle = (request, sender) => {
  let action = queue.push({
    code: request.code,
    ctrl: request.ctrl
  });
  if (!action) {
    return Promise.resolve();
  }

  return backgroundReducers(undefined, action, sender).then(() => {
    return browser.tabs.sendMessage(sender.tab.id, action);
  });
};

const normalizeUrl = (string) => {
  try {
    return new URL(string).href
  } catch (e) {
    return 'http://' + string;
  }
}

const cmdBuffer = (sender, arg) => {
  if (isNaN(arg)) {
    return tabs.selectByKeyword(sender.tab, arg);
  } else {
    let index = parseInt(arg, 10) - 1;
    return tabs.selectAt(index);
  }
}

const cmdEnterHandle = (request, sender) => {
  let words = request.text.split(' ').filter((s) => s.length > 0);
  switch (words[0]) {
  case 'open':
    return browser.tabs.update(sender.tab.id, { url: normalizeUrl(words[1]) });
  case 'tabopen':
    return browser.tabs.create({ url: normalizeUrl(words[1]) });
  case 'b':
  case 'buffer':
    return cmdBuffer(sender, words[1]);
  }
  throw new Error(words[0] + ' command is not defined');
};

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.type) {
  case 'event.keypress':
    return keyPressHandle(request, sender);
  case 'event.cmd.enter':
    return cmdEnterHandle(request, sender);
  default:
    return browser.tabs.sendMessage(sender.tab.id, request);
  }
});

browser.runtime.onMessage.addListener((action, sender) => {
  return backgroundReducers(undefined, action, sender);
});
