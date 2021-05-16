import FindClient, {
  FindResult,
} from "../../../src/background/clients/FindClient";

export default class MockFindClient implements FindClient {
  highlightAll(): Promise<void> {
    throw new Error("not implemented");
  }

  removeHighlights(): Promise<void> {
    throw new Error("not implemented");
  }

  selectKeyword(
    _tabId: number,
    _rangeData: browser.find.RangeData
  ): Promise<void> {
    throw new Error("not implemented");
  }

  startFind(_keyword: string): Promise<FindResult> {
    throw new Error("not implemented");
  }
}
