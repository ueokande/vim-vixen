import messages from '../../shared/messages';
import CommandController from '../controllers/command';
import SettingController from '../controllers/setting';
import FindController from '../controllers/find';
import AddonEnabledController from '../controllers/addon-enabled';
import LinkController from '../controllers/link';
import OperationController from '../controllers/operation';

export default class ContentMessageListener {
  constructor() {
    this.settingController = new SettingController();
    this.commandController = new CommandController();
    this.findController = new FindController();
    this.addonEnabledController = new AddonEnabledController();
    this.linkController = new LinkController();
    this.backgroundOperationController = new OperationController();
  }

  run() {
    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        let ret = this.onMessage(message, sender);
        if (!(ret instanceof Promise)) {
          return {};
        }
        return ret.catch((e) => {
          return browser.tabs.sendMessage(sender.tab.id, {
            type: messages.CONSOLE_SHOW_ERROR,
            text: e.message,
          });
        });
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return this.onConsoleQueryCompletions(message.text);
    case messages.CONSOLE_ENTER_COMMAND:
      return this.onConsoleEnterCommand(message.text);
    case messages.SETTINGS_QUERY:
      return this.onSettingsQuery();
    case messages.SETTINGS_RELOAD:
      return this.onSettingsReload();
    case messages.FIND_GET_KEYWORD:
      return this.onFindGetKeyword();
    case messages.FIND_SET_KEYWORD:
      return this.onFindSetKeyword(message.keyword);
    case messages.ADDON_ENABLED_RESPONSE:
      return this.onAddonEnabledResponse(message.enabled);
    case messages.OPEN_URL:
      return this.onOpenUrl(
        message.newTab, message.url, sender.tab.id, message.background);
    case messages.BACKGROUND_OPERATION:
      return this.onBackgroundOperation(message.operation);
    }
  }

  async onConsoleQueryCompletions(line) {
    let completions = await this.commandController.getCompletions(line);
    return Promise.resolve(completions.serialize());
  }

  onConsoleEnterCommand(text) {
    return this.commandController.exec(text);
  }


  onSettingsQuery() {
    return this.settingController.getSetting();
  }

  onSettingsReload() {
    return this.settingController.reload();
  }

  onFindGetKeyword() {
    return this.findController.getKeyword();
  }

  onFindSetKeyword(keyword) {
    return this.findController.setKeyword(keyword);
  }

  onAddonEnabledResponse(enabled) {
    return this.addonEnabledController.indicate(enabled);
  }

  onOpenUrl(newTab, url, openerId, background) {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(operation) {
    return this.backgroundOperationController.exec(operation);
  }
}
