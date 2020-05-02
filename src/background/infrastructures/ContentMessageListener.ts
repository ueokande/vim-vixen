import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";
import * as operations from "../../shared/operations";
import CommandController from "../controllers/CommandController";
import SettingController from "../controllers/SettingController";
import FindController from "../controllers/FindController";
import AddonEnabledController from "../controllers/AddonEnabledController";
import LinkController from "../controllers/LinkController";
import OperationController from "../controllers/OperationController";
import MarkController from "../controllers/MarkController";
import CompletionController from "../controllers/CompletionController";

@injectable()
export default class ContentMessageListener {
  private consolePorts: { [tabId: number]: browser.runtime.Port };

  constructor(
    private settingController: SettingController,
    private commandController: CommandController,
    private completionController: CompletionController,
    private findController: FindController,
    private addonEnabledController: AddonEnabledController,
    private linkController: LinkController,
    private operationController: OperationController,
    private markController: MarkController
  ) {
    this.consolePorts = {};
  }

  run(): void {
    browser.runtime.onMessage.addListener(
      (message: any, sender: browser.runtime.MessageSender) => {
        try {
          const ret = this.onMessage(message, sender.tab as browser.tabs.Tab);
          if (!(ret instanceof Promise)) {
            return {};
          }
          return ret.catch((e) => {
            if (!sender.tab || !sender.tab.id) {
              return;
            }
            return browser.tabs.sendMessage(sender.tab.id, {
              type: messages.CONSOLE_SHOW_ERROR,
              text: e.message,
            });
          });
        } catch (e) {
          if (!sender.tab || !sender.tab.id) {
            return;
          }
          return browser.tabs.sendMessage(sender.tab.id, {
            type: messages.CONSOLE_SHOW_ERROR,
            text: e.message,
          });
        }
      }
    );
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  onMessage(
    message: messages.Message,
    senderTab: browser.tabs.Tab
  ): Promise<any> | any {
    switch (message.type) {
      case messages.CONSOLE_GET_COMPLETION_TYPES:
        return this.completionController.getCompletionTypes();
      case messages.CONSOLE_REQUEST_SEARCH_ENGINES_MESSAGE:
        return this.completionController.requestSearchEngines(message.query);
      case messages.CONSOLE_REQUEST_BOOKMARKS:
        return this.completionController.requestBookmarks(message.query);
      case messages.CONSOLE_REQUEST_HISTORY:
        return this.completionController.requestHistory(message.query);
      case messages.CONSOLE_REQUEST_TABS:
        return this.completionController.queryTabs(
          message.query,
          message.excludePinned
        );
      case messages.CONSOLE_GET_PROPERTIES:
        return this.completionController.getProperties();
      case messages.CONSOLE_ENTER_COMMAND:
        return this.onConsoleEnterCommand(message.text);
      case messages.SETTINGS_QUERY:
        return this.onSettingsQuery();
      case messages.FIND_GET_KEYWORD:
        return this.onFindGetKeyword();
      case messages.FIND_SET_KEYWORD:
        return this.onFindSetKeyword(message.keyword);
      case messages.ADDON_ENABLED_RESPONSE:
        return this.onAddonEnabledResponse(message.enabled);
      case messages.OPEN_URL:
        return this.onOpenUrl(
          message.newTab,
          message.url,
          senderTab.id as number,
          message.background
        );
      case messages.BACKGROUND_OPERATION:
        return this.onBackgroundOperation(message.repeat, message.operation);
      case messages.MARK_SET_GLOBAL:
        return this.onMarkSetGlobal(message.key, message.x, message.y);
      case messages.MARK_JUMP_GLOBAL:
        return this.onMarkJumpGlobal(message.key);
      case messages.CONSOLE_FRAME_MESSAGE:
        return this.onConsoleFrameMessage(
          senderTab.id as number,
          message.message
        );
    }
    throw new Error("unsupported message: " + message.type);
  }

  onConsoleEnterCommand(text: string): Promise<any> {
    return this.commandController.exec(text);
  }

  async onSettingsQuery(): Promise<any> {
    return (await this.settingController.getSetting()).toJSON();
  }

  onFindGetKeyword(): Promise<string> {
    return this.findController.getKeyword();
  }

  onFindSetKeyword(keyword: string): Promise<any> {
    return this.findController.setKeyword(keyword);
  }

  onAddonEnabledResponse(enabled: boolean): Promise<any> {
    return this.addonEnabledController.indicate(enabled);
  }

  onOpenUrl(
    newTab: boolean,
    url: string,
    openerId: number,
    background: boolean
  ): Promise<any> {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(count: number, op: operations.Operation): Promise<any> {
    return this.operationController.exec(count, op);
  }

  onMarkSetGlobal(key: string, x: number, y: number): Promise<any> {
    return this.markController.setGlobal(key, x, y);
  }

  onMarkJumpGlobal(key: string): Promise<any> {
    return this.markController.jumpGlobal(key);
  }

  onConsoleFrameMessage(tabId: number, message: any): void {
    const port = this.consolePorts[tabId];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }

  onConnected(port: browser.runtime.Port): void {
    if (port.name !== "vimvixen-console") {
      return;
    }

    if (port.sender && port.sender.tab && port.sender.tab.id) {
      const id = port.sender.tab.id;
      this.consolePorts[id] = port;
    }
  }
}
