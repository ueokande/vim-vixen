import NavigateClient from "../../../src/background/clients/NavigateClient";

export default class MockNavigateClient implements NavigateClient {
  historyNext(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  historyPrev(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  linkNext(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  linkPrev(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
