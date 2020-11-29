import sinon from "sinon";
import FindNextOperator from "../../../../src/content/operators/impls/FindNextOperator";
import MockFindMasterClient from "../../mock/MockFindMasterClient";

describe("FindNextOperator", () => {
  describe("#run", () => {
    it("find next keyword", async () => {
      const client = new MockFindMasterClient();
      const mock = sinon.mock(client).expects("findNext").exactly(3);
      const sut = new FindNextOperator(client, 3);

      await sut.run();

      mock.verify();
    });
  });
});
