import { injectable } from "tsyringe";
import MessageListener from "./MessageListener";
import MarkController from "./controllers/MarkController";
import FollowMasterController from "./controllers/FollowMasterController";
import FollowSlaveController from "./controllers/FollowSlaveController";
import FollowKeyController from "./controllers/FollowKeyController";
import InputDriver from "./InputDriver";
import KeymapController from "./controllers/KeymapController";
import AddonEnabledUseCase from "./usecases/AddonEnabledUseCase";
import MarkKeyController from "./controllers/MarkKeyController";
import AddonEnabledController from "./controllers/AddonEnabledController";
import SettingController from "./controllers/SettingController";
import ConsoleFrameController from "./controllers/ConsoleFrameController";
import NavigateController from "./controllers/NavigateController";
import * as messages from "../shared/messages";
import FindController from "./controllers/FindController";

type Message = messages.Message;

@injectable()
export default class Application {
  // eslint-disable-next-line max-params
  constructor(
    private messageListener: MessageListener,
    private markController: MarkController,
    private followMasterController: FollowMasterController,
    private followSlaveController: FollowSlaveController,
    private followKeyController: FollowKeyController,
    private keymapController: KeymapController,
    private addonEnabledUseCase: AddonEnabledUseCase,
    private markKeyController: MarkKeyController,
    private addonEnabledController: AddonEnabledController,
    private settingController: SettingController,
    private consoleFrameController: ConsoleFrameController,
    private navigateController: NavigateController,
    private findController: FindController
  ) {}

  init(): Promise<void> {
    this.routeFocusEvents();
    if (window.self === window.top) {
      this.routeMasterComponents();
    }
    this.routeCommonComponents();
    // Make sure the background script sends a message to the content script by
    // establishing a connection.  If the background script tries to send a
    // message to a frame on which cannot run the content script, it fails with
    // a message "Could not establish connection."
    //
    // The port is never used, and the messages are delivered via
    // `browser.tabs.sendMessage` API because sending a message via port cannot
    // receive returned value.
    //
    // /* on background script */
    // port.sendMessage({ type: "do something" });  <- returns void
    //
    browser.runtime.connect(undefined, { name: "vimvixen-find" });
    return Promise.resolve();
  }

  private routeMasterComponents() {
    this.messageListener.onWebMessage((msg: Message, sender: Window) => {
      switch (msg.type) {
        case messages.CONSOLE_UNFOCUS:
          return this.consoleFrameController.unfocus(msg);
        case messages.FOLLOW_START:
          return this.followMasterController.followStart(msg);
        case messages.FOLLOW_RESPONSE_COUNT_TARGETS:
          return this.followMasterController.responseCountTargets(msg, sender);
        case messages.FOLLOW_KEY_PRESS:
          return this.followMasterController.keyPress(msg);
      }
      return undefined;
    });
  }

  private routeCommonComponents(): Promise<void> {
    this.messageListener.onWebMessage((msg: Message) => {
      switch (msg.type) {
        case messages.FOLLOW_REQUEST_COUNT_TARGETS:
          return this.followSlaveController.countTargets(msg);
        case messages.FOLLOW_CREATE_HINTS:
          return this.followSlaveController.createHints(msg);
        case messages.FOLLOW_SHOW_HINTS:
          return this.followSlaveController.showHints(msg);
        case messages.FOLLOW_ACTIVATE:
          return this.followSlaveController.activate(msg);
        case messages.FOLLOW_REMOVE_HINTS:
          return this.followSlaveController.clear(msg);
      }
      return undefined;
    });

    this.messageListener.onBackgroundMessage((msg: Message): any => {
      switch (msg.type) {
        case messages.SETTINGS_CHANGED:
          return this.settingController.reloadSettings(msg);
        case messages.ADDON_TOGGLE_ENABLED:
          return this.addonEnabledUseCase.toggle();
        case messages.NAVIGATE_HISTORY_NEXT:
          return this.navigateController.openHistoryNext(msg);
        case messages.NAVIGATE_HISTORY_PREV:
          return this.navigateController.openHistoryPrev(msg);
        case messages.NAVIGATE_LINK_NEXT:
          return this.navigateController.openLinkNext(msg);
        case messages.NAVIGATE_LINK_PREV:
          return this.navigateController.openLinkPrev(msg);
        case messages.CONSOLE_RESIZE:
          return this.consoleFrameController.resize(msg);
        case messages.FIND_NEXT:
          return this.findController.findNext(msg.keyword);
        case messages.FIND_PREV:
          return this.findController.findPrev(msg.keyword);
        case messages.FIND_CLEAR_SELECTION:
          return this.findController.clearSelection();
      }

      if (window.self === window.top) {
        switch (msg.type) {
          case messages.ADDON_ENABLED_QUERY:
            return this.addonEnabledController.getAddonEnabled(msg);
          case messages.TAB_SCROLL_TO:
            return this.markController.scrollTo(msg);
        }
      }
    });

    const inputDriver = new InputDriver(window.document.body);
    inputDriver.onKey((key) => this.followKeyController.press(key));
    inputDriver.onKey((key) => this.markKeyController.press(key));
    inputDriver.onKey((key) => this.keymapController.press(key));

    return this.settingController.initSettings();
  }

  private routeFocusEvents() {
    window.addEventListener("blur", () => {
      this.keymapController.onBlurWindow();
    });
  }
}
