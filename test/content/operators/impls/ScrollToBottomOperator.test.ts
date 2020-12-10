import { expect } from "chai";
import ScrollToBottomOperator from "../../../../src/content/operators/impls/ScrollToBottomOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("ScrollToBottomOperator", () => {
  describe("#run", () => {
    it("scroll to bottom", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new ScrollToBottomOperator(presenter, settingRepository);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 0, y: Infinity });
    });
  });
});
