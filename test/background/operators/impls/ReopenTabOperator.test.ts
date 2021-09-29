import ReopenTabOperator from "../../../../src/background/operators/impls/ReopenTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("ReopenTabOperator", () => {
  describe("#run", () => {
    it("reopens closed tabs", async () => {
      const tabPresenter = new MockTabPresenter();
      const reopenSpy = jest
        .spyOn(tabPresenter, "reopen")
        .mockReturnValue(Promise.resolve());

      const sut = new ReopenTabOperator(tabPresenter);
      await sut.run();

      expect(reopenSpy).toBeCalled();
    });
  });
});
