import MessageListener from './MessageListener';
import FindController from './controllers/FindController';
import MarkController from './controllers/MarkController';
import FollowMasterController from './controllers/FollowMasterController';
import FollowSlaveController from './controllers/FollowSlaveController';
import FollowKeyController from './controllers/FollowKeyController';
import InputDriver from './InputDriver';
import KeymapController from './controllers/KeymapController';
import AddonEnabledUseCase from './usecases/AddonEnabledUseCase';
import MarkKeyController from './controllers/MarkKeyController';
import AddonEnabledController from './controllers/AddonEnabledController';
import SettingController from './controllers/SettingController';
import ConsoleFrameController from './controllers/ConsoleFrameController';
import * as messages from '../shared/messages';

export const routeComponents = () => {
  let listener = new MessageListener();

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

  let settingController = new SettingController();
  settingController.initSettings();

  listener.onBackgroundMessage((message: messages.Message): any => {
    let addonEnabledUseCase = new AddonEnabledUseCase();

    switch (message.type) {
    case messages.SETTINGS_CHANGED:
      return settingController.reloadSettings(message);
    case messages.ADDON_TOGGLE_ENABLED:
      return addonEnabledUseCase.toggle();
    }
  });
};

export const routeMasterComponents = () => {
  let listener = new MessageListener();

  let findController = new FindController();
  let followMasterController = new FollowMasterController();
  let markController = new MarkController();
  let addonEnabledController = new AddonEnabledController();
  let consoleFrameController = new ConsoleFrameController();

  listener.onWebMessage((message: messages.Message, sender: Window) => {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return findController.start(message);
    case messages.FIND_NEXT:
      return findController.next(message);
    case messages.FIND_PREV:
      return findController.prev(message);
    case messages.CONSOLE_UNFOCUS:
      return consoleFrameController.unfocus(message);
    case messages.FOLLOW_START:
      return followMasterController.followStart(message);
    case messages.FOLLOW_RESPONSE_COUNT_TARGETS:
      return followMasterController.responseCountTargets(message, sender);
    case messages.FOLLOW_KEY_PRESS:
      return followMasterController.keyPress(message);
    }
    return undefined;
  });

  listener.onBackgroundMessage((message: messages.Message) => {
    switch (message.type) {
    case messages.ADDON_ENABLED_QUERY:
      return addonEnabledController.getAddonEnabled(message);
    case messages.TAB_SCROLL_TO:
      return markController.scrollTo(message);
    }
    return undefined;
  });
};
