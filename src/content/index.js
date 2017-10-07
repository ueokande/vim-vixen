import './console-frame.scss';
import * as consoleFrames from './console-frames';
import * as settingActions from 'actions/setting';
import { createStore } from 'store';
import ContentInputComponent from 'components/content-input';
import FollowComponent from 'components/follow';
import reducers from 'reducers';
import messages from './messages';

const store = createStore(reducers);
const followComponent = new FollowComponent(window.document.body, store);
const contentInputComponent = new ContentInputComponent(window, store);
store.subscribe(() => {
  try {
    followComponent.update();
    contentInputComponent.update();
  } catch (e) {
    console.error(e);
  }
});

consoleFrames.initialize(window.document);

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case messages.CONSOLE_HIDE:
    window.focus();
    consoleFrames.blur(window.document);
    return Promise.resolve();
  case messages.CONTENT_SET_SETTINGS:
    store.dispatch(settingActions.set(action.settings));
    return Promise.resolve();
  default:
    return Promise.resolve();
  }
});
