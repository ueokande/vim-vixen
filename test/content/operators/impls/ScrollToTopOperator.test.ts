import { expect } from "chai";
import ScrollToTopOperator from "../../../../src/content/operators/impls/ScrollToTopOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("ScrollToTopOperator", () => {
  describe("#run", () => {
    it("scroll to top", async () => {
      const presenter = new MockScrollPresenter(10, 10);
      const settingRepository = new MockSettingRepository();
      const sut = new ScrollToTopOperator(presenter, settingRepository);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 10, y: 0 });
    });
  });
});
