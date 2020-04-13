import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";

@injectable()
export default class NavigateClient {
  async historyNext(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.NAVIGATE_HISTORY_NEXT,
    });
  }

  async historyPrev(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.NAVIGATE_HISTORY_PREV,
    });
  }

  async linkNext(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.NAVIGATE_LINK_NEXT,
    });
  }

  async linkPrev(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.NAVIGATE_LINK_PREV,
    });
  }
}
