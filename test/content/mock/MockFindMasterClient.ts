import FindMasterClient from "../../../src/content/client/FindMasterClient";

export default class MockFindMasterClient implements FindMasterClient {
  findNext(): void {
    throw new Error("not implemented");
  }

  findPrev(): void {
    throw new Error("not implemented");
  }
}
