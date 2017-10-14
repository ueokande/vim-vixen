import './console-frame.scss';
import * as consoleFrames from './console-frames';
import * as inputActions from './actions/input';
import { createStore } from 'shared/store';
import ContentInputComponent from 'content/components/content-input';
import KeymapperComponent from 'content/components/keymapper';
import FollowComponent from 'content/components/follow';
import reducers from 'content/reducers';
import messages from 'shared/messages';

const store = createStore(reducers);
const followComponent = new FollowComponent(window, store);
const contentInputComponent =
  new ContentInputComponent(window.document.body, store);
const keymapperComponent = new KeymapperComponent(store);
contentInputComponent.onKey((key, ctrl) => {
  return followComponent.key(key, ctrl);
});
contentInputComponent.onKey((key, ctrl) => {
  return keymapperComponent.key(key, ctrl);
});
store.subscribe(() => {
  try {
    followComponent.update();
    contentInputComponent.update();
  } catch (e) {
    console.error(e);
  }
});

const reloadSettings = () => {
  return browser.runtime.sendMessage({
    type: messages.SETTINGS_QUERY,
  }).then((settings) => {
    store.dispatch(inputActions.setKeymaps(settings.keymaps));
  });
};

// TODO: the followin methods should be implemented in each top component and
// frame component
const initTopComponents = () => {
  consoleFrames.initialize(window.document);

  browser.runtime.onMessage.addListener((action) => {
    switch (action.type) {
    case messages.CONSOLE_HIDE_COMMAND:
      window.focus();
      consoleFrames.blur(window.document);
      return Promise.resolve();
    case messages.SETTINGS_CHANGED:
      return reloadSettings();
    default:
      return Promise.resolve();
    }
  });
};

const initFrameConponents = () => {
  browser.runtime.onMessage.addListener((action) => {
    switch (action.type) {
    case messages.CONSOLE_HIDE_COMMAND:
      window.focus();
      return Promise.resolve();
    case messages.SETTINGS_CHANGED:
      return reloadSettings();
    default:
      return Promise.resolve();
    }
  });
};

if (window.self === window.top) {
  initTopComponents();
} else {
  initFrameConponents();
}

reloadSettings();
