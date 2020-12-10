import { expect } from "chai";
import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("TogglePinnedTabOperator", () => {
  describe("#run", () => {
    it("toggle pinned to the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", {
        active: true,
        pinned: false,
      });
      await tabPresenter.create("https://example.com/", {
        active: false,
        pinned: false,
      });
      const sut = new TogglePinnedTabOperator(tabPresenter);

      await sut.run();
      expect((await tabPresenter.getAll()).map((t) => t.pinned)).to.deep.equal([
        true,
        false,
      ]);

      await sut.run();
      expect((await tabPresenter.getAll()).map((t) => t.pinned)).to.deep.equal([
        false,
        false,
      ]);
    });
  });
});
