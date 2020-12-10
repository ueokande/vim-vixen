import * as messages from "../../shared/messages";

export default interface NavigateClient {
  historyNext(tabId: number): Promise<void>;

  historyPrev(tabId: number): Promise<void>;

  linkNext(tabId: number): Promise<void>;

  linkPrev(tabId: number): Promise<void>;
}

export class NavigateClientImpl implements NavigateClient {
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
