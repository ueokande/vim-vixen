import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";

export default interface ConsoleClient {
  showCommand(tabId: number, command: string): Promise<void>;

  showFind(tabId: number): Promise<void>;

  showInfo(tabId: number, message: string): Promise<void>;

  showError(tabId: number, message: string): Promise<void>;

  hide(tabId: number): Promise<void>;
}

@injectable()
export class ConsoleClientImpl implements ConsoleClient {
  showCommand(tabId: number, command: string): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_COMMAND,
      command,
    });
  }

  showFind(tabId: number): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_FIND,
    });
  }

  showInfo(tabId: number, message: string): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_INFO,
      text: message,
    });
  }

  showError(tabId: number, message: string): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: message,
    });
  }

  hide(tabId: number): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_HIDE,
    });
  }
}
