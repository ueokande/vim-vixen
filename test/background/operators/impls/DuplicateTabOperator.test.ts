import { expect } from "chai";
import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("DuplicateTabOperator", () => {
  describe("#run", () => {
    it("duplicate a tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const sut = new DuplicateTabOperator(tabPresenter);

      await sut.run();

      const tabs = await tabPresenter.getAll();
      expect(tabs.map((t) => t.url)).to.deep.equal([
        "https://example.com/1",
        "https://example.com/2",
        "https://example.com/3",
        "https://example.com/2",
      ]);
    });
  });
});
