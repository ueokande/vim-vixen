import * as keys from './keys';
import * as inputActions from '../actions/input';
import * as operationActions from '../actions/operation';
import * as commandActions from '../actions/command';
import * as consoleActions from '../actions/console';
import reducers from '../reducers';
import messages from '../messages';
import * as store from '../store'

let prevInput = [];
const backgroundStore = store.createStore(reducers, (e) => {
  console.error('Vim-Vixen:', e);
});
backgroundStore.subscribe(() => {
  let currentInput = backgroundStore.getState().input
  if (JSON.stringify(prevInput) === JSON.stringify(currentInput)) {
    return
  }
  prevInput = currentInput;

  if (currentInput.keys.length === 0) {
    return;
  }

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs.length > 0) {
      return keyQueueChanged(tabs[0], backgroundStore.getState());
    }
  });
});
backgroundStore.subscribe(() => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs.length > 0) {
      return browser.tabs.sendMessage(tabs[0].id, {
        type: 'state.changed',
        state: backgroundStore.getState()
      });
    }
  });
});

const keyQueueChanged = (sendToTab, state) => {
  let prefix = keys.asKeymapChars(state.input.keys);
  let matched = Object.keys(keys.defaultKeymap).filter((keys) => {
    return keys.startsWith(prefix);
  });
  if (matched.length == 0) {
    backgroundStore.dispatch(inputActions.clearKeys());
    return Promise.resolve();
  } else if (matched.length > 1 || matched.length === 1 && prefix !== matched[0]) {
    return Promise.resolve();
  }
  let action = keys.defaultKeymap[matched];
  backgroundStore.dispatch(operationActions.exec(action, sendToTab));
  backgroundStore.dispatch(inputActions.clearKeys());
  return browser.tabs.sendMessage(sendToTab.id, action);
};

const handleMessage = (action, sendToTab) => {
  backgroundStore.dispatch(action);

  return browser.tabs.sendMessage(sendToTab.id, action);
};

browser.runtime.onMessage.addListener((action, sender) => {
  handleMessage(action, sender.tab);
});

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
  case messages.CONSOLE_BLURRED:
    backgroundStore.dispatch(consoleActions.hide());
    break;
  case messages.CONSOLE_ENTERED:
    backgroundStore.dispatch(commandActions.exec(message.text));
    break;
  case messages.CONSOLE_CHANGEED:
    backgroundStore.dispatch(commandActions.complete(message.text));
    break;
  }
});
