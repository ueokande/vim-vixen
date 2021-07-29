import FindClient from "../../../src/background/clients/FindClient";

export default class MockFindClient implements FindClient {
  findNext(
    _tabId: number,
    _frameId: number,
    _keyword: string
  ): Promise<boolean> {
    throw new Error("not implemented");
  }

  findPrev(
    _tabId: number,
    _frameId: number,
    _keyword: string
  ): Promise<boolean> {
    throw new Error("not implemented");
  }

  clearSelection(_tabId: number, _frameId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
