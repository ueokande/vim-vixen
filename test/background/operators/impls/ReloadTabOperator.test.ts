import sinon from "sinon";
import ReloadTabOperator from "../../../../src/background/operators/impls/ReloadTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("ReloadTabOperator", () => {
  describe("#run", () => {
    it("reloads the current tab with cache", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", { active: true });
      await tabPresenter.create("https://example.com/", { active: false });
      const mock = sinon.mock(tabPresenter).expects("reload").withArgs(0, true);

      const sut = new ReloadTabOperator(tabPresenter, true);
      await sut.run();

      mock.verify();
    });

    it("reloads the current tab without cache", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", { active: true });
      await tabPresenter.create("https://example.com/", { active: false });
      const mock = sinon
        .mock(tabPresenter)
        .expects("reload")
        .withArgs(0, false);

      const sut = new ReloadTabOperator(tabPresenter, false);
      await sut.run();

      mock.verify();
    });
  });
});
