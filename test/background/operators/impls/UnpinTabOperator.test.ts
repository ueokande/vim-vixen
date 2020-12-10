import { expect } from "chai";
import UnpinTabOperator from "../../../../src/background/operators/impls/UnpinTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("UnpinTabOperator", () => {
  describe("#run", () => {
    it("make unpinned to the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", {
        active: true,
        pinned: true,
      });
      await tabPresenter.create("https://example.com/", {
        active: false,
        pinned: true,
      });
      const sut = new UnpinTabOperator(tabPresenter);

      await sut.run();

      const pins = (await tabPresenter.getAll()).map((t) => t.pinned);
      expect(pins).to.deep.equal([false, true]);
    });
  });
});
