import MockTabPresenter from "../../mock/MockTabPresenter";
import SelectTabPrevOperator from "../../../../src/background/operators/impls/SelectTabPrevOperator";

describe("SelectTabPrevOperator", () => {
  describe("#run", () => {
    it("select a left tab of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });

      const sut = new SelectTabPrevOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/1");
    });
  });

  describe("#run", () => {
    it("select a left tab of the current tab in rotation", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: true });
      await tabPresenter.create("https://example.com/2", { active: false });
      await tabPresenter.create("https://example.com/3", { active: false });

      const sut = new SelectTabPrevOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/3");
    });
  });
});
