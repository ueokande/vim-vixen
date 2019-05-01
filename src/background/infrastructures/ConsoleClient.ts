import messages from '../../shared/messages';

export default class ConsoleClient {
  showCommand(tabId: number, command: string): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_COMMAND,
      command,
    });
  }

  showFind(tabId: number): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_FIND
    });
  }

  showInfo(tabId: number, message: string): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_INFO,
      text: message,
    });
  }

  showError(tabId: number, message: string): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: message,
    });
  }

  hide(tabId: number): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_HIDE,
    });
  }
}

