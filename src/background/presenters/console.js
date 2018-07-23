import messages from '../../shared/messages';

export default class ConsolePresenter {
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
}
