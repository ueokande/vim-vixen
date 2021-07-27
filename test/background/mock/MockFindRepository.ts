import FindRepository, {
  FindState,
} from "../../../src/background/repositories/FindRepository";

export default class MockFindRepository implements FindRepository {
  private globalKeyword: string | undefined;
  private localStates: { [tabId: number]: FindState } = {};

  getGlobalKeyword(): Promise<string | undefined> {
    return Promise.resolve(this.globalKeyword);
  }

  setGlobalKeyword(keyword: string): Promise<void> {
    this.globalKeyword = keyword;
    return Promise.resolve();
  }

  getLocalState(tabId: number): Promise<FindState | undefined> {
    return Promise.resolve(this.localStates[tabId]);
  }

  setLocalState(tabId: number, state: FindState): Promise<void> {
    this.localStates[tabId] = state;
    return Promise.resolve();
  }

  deleteLocalState(tabId: number): Promise<void> {
    delete this.localStates[tabId];
    return Promise.resolve();
  }
}
