import { expect } from "chai";
import CloseTabOperator from "../../../../src/background/operators/impls/CloseTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("CloseTabOperator", () => {
  describe("#run", () => {
    it("close a current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new CloseTabOperator(tabPresenter);

      await sut.run();

      const tabs = await tabPresenter.getAll();
      expect(tabs.map((t) => t.url)).to.deep.equal([
        "https://example.com/1",
        "https://example.com/3",
      ]);
    });

    it("close a current tab forcely", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", {
        pinned: true,
        active: false,
      });
      await tabPresenter.create("https://example.com/2", {
        pinned: true,
        active: true,
      });
      await tabPresenter.create("https://example.com/3", {
        pinned: true,
        active: false,
      });
      const sut = new CloseTabOperator(tabPresenter, true);

      await sut.run();

      const tabs = await tabPresenter.getAll();
      expect(tabs.map((t) => t.url)).to.deep.equal([
        "https://example.com/1",
        "https://example.com/3",
      ]);
    });

    it("close a current tab and select left of the closed tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new CloseTabOperator(tabPresenter, false, true);

      await sut.run();

      const tab = await tabPresenter.getCurrent();
      expect(tab.url).to.equal("https://example.com/1");
    });
  });
});
