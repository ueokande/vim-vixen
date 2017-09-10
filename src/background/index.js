import * as tabs from './tabs';
import * as keys from './keys';
import * as inputActions from '../actions/input';
import backgroundReducers from '../reducers/background';
import inputReducers from '../reducers/input';

let inputState = inputReducers(undefined, {});

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
  case 'event.cmd.enter':
    return cmdEnterHandle(request, sender);
  default:
    return browser.tabs.sendMessage(sender.tab.id, request);
  }
});

const keyQueueChanged = (sender, prevState, state) => {
  if (state.keys.length === 0) {
    return Promise.resolve();
  }

  let prefix = keys.asKeymapChars(state.keys);
  let matched = Object.keys(keys.defaultKeymap).filter((keys) => {
    return keys.startsWith(prefix);
  });
  if (matched.length == 0) {
    return handleMessage(inputActions.clearKeys(), sender);
  } else if (matched.length > 1 || matched.length === 1 && prefix !== matched[0]) {
    return Promise.resolve();
  }
  let action = keys.defaultKeymap[matched];
  return handleMessage(inputActions.clearKeys(), sender).then(() => {
    return backgroundReducers(undefined, action, sender).then(() => {
      return browser.tabs.sendMessage(sender.tab.id, action);
    });
  });
};

const handleMessage = (action, sender) => {
  let nextInputState = inputReducers(inputState, action);
  if (JSON.stringify(nextInputState) !== JSON.stringify(inputState)) {
    let prevState = inputState;
    inputState = nextInputState;
    return keyQueueChanged(sender, prevState, inputState);
  }
  return backgroundReducers(undefined, action, sender);
};

browser.runtime.onMessage.addListener(handleMessage);
