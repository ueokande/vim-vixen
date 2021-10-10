import MockTabPresenter from "../../mock/MockTabPresenter";
import SelectTabNextOperator from "../../../../src/background/operators/impls/SelectTabNextOperator";

describe("SelectTabNextOperator", () => {
  describe("#run", () => {
    it("select a right tab of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });

      const sut = new SelectTabNextOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/3");
    });
  });

  describe("#run", () => {
    it("select a right tab of the current tab in rotation", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: false });
      await tabPresenter.create("https://example.com/3", { active: true });

      const sut = new SelectTabNextOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/1");
    });
  });
});
