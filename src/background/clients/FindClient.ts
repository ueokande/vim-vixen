import * as messages from "../../shared/messages";

export default interface FindClient {
  findNext(tabId: number, frameId: number, keyword: string): Promise<boolean>;

  clearSelection(tabId: number, frameId: number): Promise<void>;
}

export class FindClientImpl implements FindClient {
  async findNext(
    tabId: number,
    frameId: number,
    keyword: string
  ): Promise<boolean> {
    const found = (await browser.tabs.sendMessage(
      tabId,
      { type: messages.FIND_NEXT, keyword },
      { frameId }
    )) as boolean;
    return found;
  }

  clearSelection(tabId: number, frameId: number): Promise<void> {
    return browser.tabs.sendMessage(
      tabId,
      { type: messages.FIND_CLEAR_SELECTION },
      { frameId }
    );
  }
}
