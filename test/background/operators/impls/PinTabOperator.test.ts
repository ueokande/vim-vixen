import { expect } from "chai";
import PinTabOperator from "../../../../src/background/operators/impls/PinTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("PinTabOperator", () => {
  describe("#run", () => {
    it("make pinned to the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/", {
        active: true,
        pinned: false,
      });
      await tabPresenter.create("https://example.com/", {
        active: false,
        pinned: false,
      });
      const sut = new PinTabOperator(tabPresenter);

      await sut.run();

      const pins = (await tabPresenter.getAll()).map((t) => t.pinned);
      expect(pins).to.deep.equal([true, false]);
    });
  });
});
