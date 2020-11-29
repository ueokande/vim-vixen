import sinon from "sinon";
import StartFollowOperator from "../../../../src/content/operators/impls/StartFollowOperator";
import MockFollowMasterClient from "../../mock/MockFollowMasterClient";

describe("StartFollowOperator", () => {
  describe("#run", () => {
    it("starts following links", async () => {
      const client = new MockFollowMasterClient();
      const mock = sinon
        .mock(client)
        .expects("startFollow")
        .withArgs(true, false);
      const sut = new StartFollowOperator(client, true, false);

      await sut.run();

      mock.verify();
    });
  });
});
