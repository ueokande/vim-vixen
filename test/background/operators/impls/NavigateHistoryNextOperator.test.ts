import sinon from "sinon";
import NavigateHistoryNextOperator from "../../../../src/background/operators/impls/NavigateHistoryNextOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockNavigateClient from "../../mock/MockNavigateClient";

describe("NavigateHistoryNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next in the history", async () => {
      const navigateClient = new MockNavigateClient();
      const mock = sinon
        .mock(navigateClient)
        .expects("historyNext")
        .withArgs(1);
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new NavigateHistoryNextOperator(tabPresenter, navigateClient);

      await sut.run();

      mock.verify();
    });
  });
});
