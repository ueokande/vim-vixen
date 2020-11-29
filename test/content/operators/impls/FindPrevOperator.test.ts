import sinon from "sinon";
import FindPrevOperator from "../../../../src/content/operators/impls/FindPrevOperator";
import MockFindMasterClient from "../../mock/MockFindMasterClient";

describe("FindPrevOperator", () => {
  describe("#run", () => {
    it("find previous keyword", async () => {
      const client = new MockFindMasterClient();
      const mock = sinon.mock(client).expects("findPrev").exactly(3);
      const sut = new FindPrevOperator(client, 3);

      await sut.run();

      mock.verify();
    });
  });
});
