import * as keys from './keys';
import * as inputActions from '../actions/input';
import * as operationActions from '../actions/operation';
import * as commandActions from '../actions/command';
import * as consoleActions from '../actions/console';
import * as tabActions from '../actions/tab';
import reducers from '../reducers';
import messages from '../messages';
import * as store from '../store';

let prevInput = [];

const backgroundStore = store.createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    backgroundStore.dispatch(consoleActions.showError(e.message), sender);
  }
});
backgroundStore.subscribe((sender) => {
  let currentInput = backgroundStore.getState().input;
  if (JSON.stringify(prevInput) === JSON.stringify(currentInput)) {
    return;
  }
  prevInput = currentInput;

  if (currentInput.keys.length === 0) {
    return;
  }
  if (sender) {
    return keyQueueChanged(backgroundStore.getState(), sender);
  }
});
backgroundStore.subscribe((sender) => {
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.STATE_UPDATE,
      state: backgroundStore.getState()
    });
  }
});

const keyQueueChanged = (state, sender) => {
  let prefix = keys.asKeymapChars(state.input.keys);
  let matched = Object.keys(state.input.keymaps).filter((keyStr) => {
    return keyStr.startsWith(prefix);
  });
  if (matched.length === 0) {
    backgroundStore.dispatch(inputActions.clearKeys(), sender);
    return Promise.resolve();
  } else if (matched.length > 1 ||
    matched.length === 1 && prefix !== matched[0]) {
    return Promise.resolve();
  }
  let action = state.input.keymaps[matched];
  backgroundStore.dispatch(operationActions.exec(action, sender.tab), sender);
  backgroundStore.dispatch(inputActions.clearKeys(), sender);
};

const reloadSettings = () => {
  browser.storage.local.get('settings').then((value) => {
    let settings = JSON.parse(value.settings.json);
    let action = inputActions.setKeymaps(settings.keymaps);
    backgroundStore.dispatch(action);
  }, console.error);
};

const handleMessage = (message, sender) => {
  switch (message.type) {
  case messages.KEYDOWN:
    return backgroundStore.dispatch(
      inputActions.keyPress(message.code, message.ctrl), sender);
  case messages.OPEN_URL:
    if (message.newTab) {
      return backgroundStore.dispatch(
        tabActions.openNewTab(message.url), sender);
    }
    return backgroundStore.dispatch(
      tabActions.openToTab(message.url, sender.tab), sender);
  case messages.CONSOLE_BLURRED:
    return backgroundStore.dispatch(
      consoleActions.hide(), sender);
  case messages.CONSOLE_ENTERED:
    return backgroundStore.dispatch(
      commandActions.exec(message.text), sender);
  case messages.CONSOLE_CHANGEED:
    return backgroundStore.dispatch(
      commandActions.complete(message.text), sender);
  case messages.SETTINGS_RELOAD:
    return reloadSettings();
  }
};

browser.runtime.onMessage.addListener((message, sender) => {
  try {
    handleMessage(message, sender);
  } catch (e) {
    backgroundStore.dispatch(consoleActions.showError(e.message), sender);
  }
});

const initializeSettings = () => {
  reloadSettings();
};

initializeSettings();
