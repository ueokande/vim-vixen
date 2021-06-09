import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";
import * as operations from "../../shared/operations";
import CommandController from "../controllers/CommandController";
import SettingController from "../controllers/SettingController";
import AddonEnabledController from "../controllers/AddonEnabledController";
import LinkController from "../controllers/LinkController";
import OperationController from "../controllers/OperationController";
import MarkController from "../controllers/MarkController";
import CompletionController from "../controllers/CompletionController";
import ConsoleController from "../controllers/ConsoleController";

@injectable()
export default class ContentMessageListener {
  private readonly consolePorts: { [tabId: number]: browser.runtime.Port } = {};

  constructor(
    private readonly settingController: SettingController,
    private readonly commandController: CommandController,
    private readonly completionController: CompletionController,
    private readonly addonEnabledController: AddonEnabledController,
    private readonly linkController: LinkController,
    private readonly operationController: OperationController,
    private readonly markController: MarkController,
    private readonly consoleController: ConsoleController
  ) {}

  run(): void {
    browser.runtime.onMessage.addListener(
      (message: any, sender: browser.runtime.MessageSender) => {
        try {
          const ret = this.onMessage(message, sender.tab as browser.tabs.Tab);
          if (!(ret instanceof Promise)) {
            return {};
          }
          return ret.catch((e) => {
            console.error(e);
            if (!sender.tab || !sender.tab.id) {
              return;
            }
            return browser.tabs.sendMessage(sender.tab.id, {
              type: messages.CONSOLE_SHOW_ERROR,
              text: e.message,
            });
          });
        } catch (e) {
          console.error(e);
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
  ): Promise<unknown> | unknown {
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
      case messages.CONSOLE_RESIZE:
        return this.onConsoleResize(
          senderTab.id!,
          message.width,
          message.height
        );
      case messages.SETTINGS_QUERY:
        return this.onSettingsQuery();
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

  onConsoleEnterCommand(text: string): Promise<unknown> {
    return this.commandController.exec(text);
  }

  onConsoleResize(
    senderTabId: number,
    width: number,
    height: number
  ): Promise<void> {
    return this.consoleController.resize(senderTabId, width, height);
  }

  async onSettingsQuery(): Promise<unknown> {
    return (await this.settingController.getSetting()).toJSON();
  }

  onAddonEnabledResponse(enabled: boolean): Promise<void> {
    return this.addonEnabledController.indicate(enabled);
  }

  onOpenUrl(
    newTab: boolean,
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(
    count: number,
    op: operations.Operation
  ): Promise<void> {
    return this.operationController.exec(count, op);
  }

  onMarkSetGlobal(key: string, x: number, y: number): Promise<void> {
    return this.markController.setGlobal(key, x, y);
  }

  onMarkJumpGlobal(key: string): Promise<void> {
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
