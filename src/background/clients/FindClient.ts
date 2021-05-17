import * as messages from "../../shared/messages";

export default interface FindClient {
  startFind(keyword: string): Promise<FindResult>;

  highlightAll(): Promise<void>;

  removeHighlights(): Promise<void>;

  selectKeyword(
    tabId: number,
    keyword: string,
    rangeData: browser.find.RangeData
  ): Promise<void>;
}

export type FindResult = {
  count: number;
  rangeData: browser.find.RangeData[];
};

export class FindClientImpl implements FindClient {
  async startFind(keyword: string): Promise<FindResult> {
    const result = await browser.find.find(keyword, {
      includeRangeData: true,
    } as any);
    return {
      count: result.count,
      rangeData: result.rangeData!,
    };
  }

  async highlightAll(): Promise<void> {
    await browser.find.highlightResults();
  }

  async removeHighlights(): Promise<void> {
    await browser.find.removeHighlighting();
  }

  async selectKeyword(
    tabId: number,
    keyword: string,
    rangeData: browser.find.RangeData
  ): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.FIND_SELECT_KEYWORD,
      keyword,
      startTextNodePos: rangeData.startTextNodePos,
      endTextNodePos: rangeData.endTextNodePos,
      startOffset: rangeData.startOffset,
      endOffset: rangeData.endOffset,
    });
  }
}
