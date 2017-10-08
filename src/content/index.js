import './console-frame.scss';
import * as consoleFrames from './console-frames';
import * as settingActions from 'actions/setting';
import { createStore } from 'store';
import ContentInputComponent from 'components/content-input';
import KeymapperComponent from 'components/keymapper';
import FollowComponent from 'components/follow';
import reducers from 'reducers';
import messages from './messages';

const store = createStore(reducers);
const followComponent = new FollowComponent(window.document.body, store);
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

consoleFrames.initialize(window.document);

const reloadSettings = () => {
  return browser.runtime.sendMessage({
    type: messages.SETTINGS_QUERY,
  }).then((settings) => {
    store.dispatch(settingActions.set(settings));
  });
};

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case messages.CONSOLE_HIDE:
    window.focus();
    consoleFrames.blur(window.document);
    return Promise.resolve();
  case messages.SETTINGS_CHANGED:
    return reloadSettings();
  default:
    return Promise.resolve();
  }
});

reloadSettings();
