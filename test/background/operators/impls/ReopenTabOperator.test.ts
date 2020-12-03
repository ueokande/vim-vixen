import sinon from "sinon";
import ReopenTabOperator from "../../../../src/background/operators/impls/ReopenTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("ReopenTabOperator", () => {
  describe("#run", () => {
    it("reopens closed tabs", async () => {
      const tabPresenter = new MockTabPresenter();
      const mock = sinon.mock(tabPresenter).expects("reopen");

      const sut = new ReopenTabOperator(tabPresenter);
      await sut.run();

      mock.verify();
    });
  });
});
