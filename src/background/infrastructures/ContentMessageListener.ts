import * as messages from '../../shared/messages';
import CompletionGroup from '../domains/CompletionGroup';
import CommandController from '../controllers/CommandController';
import SettingController from '../controllers/SettingController';
import FindController from '../controllers/FindController';
import AddonEnabledController from '../controllers/AddonEnabledController';
import LinkController from '../controllers/LinkController';
import OperationController from '../controllers/OperationController';
import MarkController from '../controllers/MarkController';

export default class ContentMessageListener {
  private settingController: SettingController;

  private commandController: CommandController;

  private findController: FindController;

  private addonEnabledController: AddonEnabledController;

  private linkController: LinkController;

  private backgroundOperationController: OperationController;

  private markController: MarkController;

  private consolePorts: {[tabId: number]: browser.runtime.Port};

  constructor() {
    this.settingController = new SettingController();
    this.commandController = new CommandController();
    this.findController = new FindController();
    this.addonEnabledController = new AddonEnabledController();
    this.linkController = new LinkController();
    this.backgroundOperationController = new OperationController();
    this.markController = new MarkController();

    this.consolePorts = {};
  }

  run(): void {
    browser.runtime.onMessage.addListener((
      message: any, sender: browser.runtime.MessageSender,
    ) => {
      try {
        let ret = this.onMessage(message, sender.tab as browser.tabs.Tab);
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
    });
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
    browser.commands.onCommand.addListener((command) => {
      const operation = { type: command };
      this.onBackgroundOperation(operation).catch(() => {
        // ignore
      });
    });
  }

  onMessage(
    message: messages.Message, senderTab: browser.tabs.Tab,
  ): Promise<any> | any {
    switch (message.type) {
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return this.onConsoleQueryCompletions(message.text);
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
        message.background);
    case messages.BACKGROUND_OPERATION:
      return this.onBackgroundOperation(message.operation);
    case messages.MARK_SET_GLOBAL:
      return this.onMarkSetGlobal(message.key, message.x, message.y);
    case messages.MARK_JUMP_GLOBAL:
      return this.onMarkJumpGlobal(message.key);
    case messages.CONSOLE_FRAME_MESSAGE:
      return this.onConsoleFrameMessage(
        senderTab.id as number, message.message,
      );
    }
    throw new Error('unsupported message: ' + message.type);
  }

  async onConsoleQueryCompletions(line: string): Promise<CompletionGroup[]> {
    let completions = await this.commandController.getCompletions(line);
    return Promise.resolve(completions);
  }

  onConsoleEnterCommand(text: string): Promise<any> {
    return this.commandController.exec(text);
  }

  onSettingsQuery(): Promise<any> {
    return this.settingController.getSetting();
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
    newTab: boolean, url: string, openerId: number, background: boolean,
  ): Promise<any> {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(operation: any): Promise<any> {
    return this.backgroundOperationController.exec(operation);
  }

  onMarkSetGlobal(key: string, x: number, y: number): Promise<any> {
    return this.markController.setGlobal(key, x, y);
  }

  onMarkJumpGlobal(key: string): Promise<any> {
    return this.markController.jumpGlobal(key);
  }

  onConsoleFrameMessage(tabId: number, message: any): void {
    let port = this.consolePorts[tabId];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }

  onConnected(port: browser.runtime.Port): void {
    if (port.name !== 'vimvixen-console') {
      return;
    }

    if (port.sender && port.sender.tab && port.sender.tab.id) {
      let id = port.sender.tab.id;
      this.consolePorts[id] = port;
    }
  }
}
