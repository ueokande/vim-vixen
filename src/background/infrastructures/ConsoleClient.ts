import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";

export default interface ConsoleClient {
  showCommand(tabId: number, command: string): Promise<any>;

  showFind(tabId: number): Promise<any>;

  showInfo(tabId: number, message: string): Promise<any>;

  showError(tabId: number, message: string): Promise<any>;

  hide(tabId: number): Promise<any>;
}

@injectable()
export class ConsoleClientImpl implements ConsoleClient {
  showCommand(tabId: number, command: string): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_COMMAND,
      command,
    });
  }

  showFind(tabId: number): Promise<any> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_FIND,
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
