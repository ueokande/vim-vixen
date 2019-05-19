// import TopContentComponent from './components/top-content';
// import FrameContentComponent from './components/frame-content';
import * as consoleFrames from './console-frames';
import consoleFrameStyle from './site-style';
// import { newStore } from './store';
import MessageListener from './MessageListener';
import FindController from './controllers/FindController';
import MarkController from './controllers/MarkController';
import FollowMasterController from './controllers/FollowMasterController';
import FollowSlaveController from './controllers/FollowSlaveController';
import FollowKeyController from './controllers/FollowKeyController';
import * as messages from '../shared/messages';
import InputDriver from './InputDriver';
import KeymapController from './controllers/KeymapController';
import AddonEnabledUseCase from './usecases/AddonEnabledUseCase';
import SettingUseCase from './usecases/SettingUseCase';
import * as blacklists from '../shared/blacklists';
import MarkKeyController from './controllers/MarkKeyController';
import AddonEnabledController from './controllers/AddonEnabledController';

// const store = newStore();

let listener = new MessageListener();
if (window.self === window.top) {
  // new TopContentComponent(window, store); // eslint-disable-line no-new

  let findController = new FindController();

  let followMasterController = new FollowMasterController();
  listener.onWebMessage((message: messages.Message, sender: Window) => {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return findController.start(message);
    case messages.FIND_NEXT:
      return findController.next(message);
    case messages.FIND_PREV:
      return findController.prev(message);
    case messages.CONSOLE_UNFOCUS:
      window.focus();
      consoleFrames.blur(window.document);
      break;
    case messages.FOLLOW_START:
      return followMasterController.followStart(message);
    case messages.FOLLOW_RESPONSE_COUNT_TARGETS:
      return followMasterController.responseCountTargets(message, sender);
    case messages.FOLLOW_KEY_PRESS:
      return followMasterController.keyPress(message);
    }
    return undefined;
  });

  let markController = new MarkController();
  let addonEnabledController = new AddonEnabledController();

  new MessageListener().onBackgroundMessage((message: messages.Message) => {
    switch (message.type) {
    case messages.ADDON_ENABLED_QUERY:
      return addonEnabledController.getAddonEnabled(message);
    case messages.TAB_SCROLL_TO:
      return markController.scrollTo(message);
    }
    return undefined;
  });

  consoleFrames.initialize(window.document);
} else {
  // new FrameContentComponent(window, store); // eslint-disable-line no-new
}

let followSlaveController = new FollowSlaveController();
listener.onWebMessage((message: messages.Message) => {
  switch (message.type) {
  case messages.FOLLOW_REQUEST_COUNT_TARGETS:
    return followSlaveController.countTargets(message);
  case messages.FOLLOW_CREATE_HINTS:
    return followSlaveController.createHints(message);
  case messages.FOLLOW_SHOW_HINTS:
    return followSlaveController.showHints(message);
  case messages.FOLLOW_ACTIVATE:
    return followSlaveController.activate(message);
  case messages.FOLLOW_REMOVE_HINTS:
    return followSlaveController.clear(message);
  }
  return undefined;
});

let keymapController = new KeymapController();
let markKeyController = new MarkKeyController();
let followKeyController = new FollowKeyController();
let inputDriver = new InputDriver(document.body);
inputDriver.onKey(key => followKeyController.press(key));
inputDriver.onKey(key => markKeyController.press(key));
inputDriver.onKey(key => keymapController.press(key));

let style = window.document.createElement('style');
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);

// TODO move the following to a class
const reloadSettings = async() => {
  let addonEnabledUseCase = new AddonEnabledUseCase();
  let settingUseCase = new SettingUseCase();

  try {
    let current = await settingUseCase.reload();
    let disabled = blacklists.includes(
      current.blacklist, window.location.href,
    );
    if (disabled) {
      addonEnabledUseCase.disable();
    } else {
      addonEnabledUseCase.enable();
    }
  } catch (e) {
    // Sometime sendMessage fails when background script is not ready.
    console.warn(e);
    setTimeout(() => reloadSettings(), 500);
  }
};
reloadSettings();

new MessageListener().onBackgroundMessage((message: messages.Message): any => {
  let addonEnabledUseCase = new AddonEnabledUseCase();

  switch (message.type) {
  case messages.SETTINGS_CHANGED:
    return reloadSettings();
  case messages.ADDON_TOGGLE_ENABLED:
    return addonEnabledUseCase.toggle();
  }
});
