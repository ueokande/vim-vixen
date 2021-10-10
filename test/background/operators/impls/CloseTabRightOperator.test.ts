import MockTabPresenter from "../../mock/MockTabPresenter";
import CloseTabRightOperator from "../../../../src/background/operators/impls/CloseTabRightOperator";

describe("CloseTabRightOperator", () => {
  describe("#run", () => {
    it("close the right of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      await tabPresenter.create("https://example.com/4", { active: false });
      const sut = new CloseTabRightOperator(tabPresenter);

      await sut.run();

      const tabs = await tabPresenter.getAll();
      expect(tabs.map((t) => t.url)).toEqual([
        "https://example.com/1",
        "https://example.com/2",
      ]);
    });
  });
});
