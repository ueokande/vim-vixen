import sinon from "sinon";
import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      const tabPresenter = new MockTabPresenter();
      const currenTab = await tabPresenter.create("https://example.com/");

      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("hide")
        .withArgs(currenTab?.id);
      const sut = new CancelOperator(tabPresenter, consoleClient);

      await sut.run();

      mock.verify();
    });
  });
});
