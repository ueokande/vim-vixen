import StartFollowOperator from "../../../../src/content/operators/impls/StartFollowOperator";
import MockFollowMasterClient from "../../mock/MockFollowMasterClient";

describe("StartFollowOperator", () => {
  describe("#run", () => {
    it("starts following links", async () => {
      const client = new MockFollowMasterClient();
      const startFollowSpy = jest
        .spyOn(client, "startFollow")
        .mockReturnValue();
      const sut = new StartFollowOperator(client, true, false);

      await sut.run();

      expect(startFollowSpy).toBeCalledWith(true, false);
    });
  });
});
