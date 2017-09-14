import * as keys from './keys';
import * as inputActions from '../actions/input';
import * as operationActions from '../actions/operation';
import backgroundReducers from '../reducers/background';
import reducers from '../reducers';
import commandReducer from '../reducers/command';
import * as store from '../store'

const backgroundStore = store.createStore(reducers, (e) => {
  console.error('Vim-Vixen:', e);
});
backgroundStore.subscribe(() => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs.length > 0) {
      return keyQueueChanged(tabs[0], backgroundStore.getState());
    }
  });
});

const keyQueueChanged = (sendToTab, state) => {
  if (state.input.keys.length === 0) {
    return Promise.resolve();
  }

  let prefix = keys.asKeymapChars(state.input.keys);
  let matched = Object.keys(keys.defaultKeymap).filter((keys) => {
    return keys.startsWith(prefix);
  });
  if (matched.length == 0) {
    return handleMessage(inputActions.clearKeys(), sendToTab);
  } else if (matched.length > 1 || matched.length === 1 && prefix !== matched[0]) {
    return Promise.resolve();
  }
  let action = keys.defaultKeymap[matched];
  backgroundStore.dispatch(operationActions.exec(action, sendToTab));
  return handleMessage(inputActions.clearKeys(), sendToTab).then(() => {
    return backgroundReducers(undefined, action, sendToTab).then(() => {
      return browser.tabs.sendMessage(sendToTab.id, action);
    });
  });
};

const handleMessage = (action, sendToTab) => {
  backgroundStore.dispatch(action);

  return backgroundReducers(undefined, action, sendToTab).then(() => {
    return commandReducer(undefined, action, sendToTab).then(() => {
      return browser.tabs.sendMessage(sendToTab.id, action);
    });
  });
};

browser.runtime.onMessage.addListener((action, sender) => {
  handleMessage(action, sender.tab);
});
