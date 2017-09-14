import * as keys from './keys';
import * as inputActions from '../actions/input';
import * as operationActions from '../actions/operation';
import backgroundReducers from '../reducers/background';
import reducers from '../reducers';
import commandReducer from '../reducers/command';
import inputReducers from '../reducers/input';
import * as store from '../store'

const backgroundStore = store.createStore(reducers, (e) => {
  console.error('Vim-Vixen:', e);
});
let inputState = inputReducers(undefined, {});

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
  backgroundStore.dispatch(operationActions.exec(action, sender));
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
  return backgroundReducers(undefined, action, sender).then(() => {
    return commandReducer(undefined, action, sender).then(() => {
      return browser.tabs.sendMessage(sender.tab.id, action);
    });
  });
};

browser.runtime.onMessage.addListener(handleMessage);
