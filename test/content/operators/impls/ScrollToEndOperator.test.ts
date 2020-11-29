import { expect } from "chai";
import ScrollToEndOperator from "../../../../src/content/operators/impls/ScrollToEndOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("ScrollToEndOperator", () => {
  describe("#run", () => {
    it("scroll to rightmost", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new ScrollToEndOperator(presenter, settingRepository);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: Infinity, y: 0 });
    });
  });
});
