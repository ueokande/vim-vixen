import ReloadTabOperator from "../../../../src/background/operators/impls/ReloadTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("ReloadTabOperator", () => {
  describe("#run", () => {
    it("reloads the current tab with cache", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", { active: true });
      await tabPresenter.create("https://example.com/", { active: false });
      const reloadSpy = jest
        .spyOn(tabPresenter, "reload")
        .mockReturnValue(Promise.resolve());

      const sut = new ReloadTabOperator(tabPresenter, true);
      await sut.run();

      expect(reloadSpy).toBeCalledWith(0, true);
    });

    it("reloads the current tab without cache", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", { active: true });
      await tabPresenter.create("https://example.com/", { active: false });
      const reloadSpy = jest
        .spyOn(tabPresenter, "reload")
        .mockReturnValue(Promise.resolve());

      const sut = new ReloadTabOperator(tabPresenter, false);
      await sut.run();

      expect(reloadSpy).toBeCalledWith(0, false);
    });
  });
});
