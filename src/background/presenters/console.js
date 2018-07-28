import messages from '../../shared/messages';

export default class ConsolePresenter {
  showCommand(tabId, command) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_COMMAND,
      command,
    });
  }

  showFind(tabId) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_FIND
    });
  }

  showInfo(tabId, message) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_INFO,
      text: message,
    });
  }

  showError(tabId, message) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: message,
    });
  }

  hide(tabId) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_HIDE,
    });
  }
}
