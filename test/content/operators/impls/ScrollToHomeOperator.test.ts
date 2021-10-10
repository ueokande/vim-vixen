import ScrollToHomeOperator from "../../../../src/content/operators/impls/ScrollToHomeOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("ScrollToHomeOperator", () => {
  describe("#run", () => {
    it("scroll to leftmost", async () => {
      const presenter = new MockScrollPresenter(10, 10);
      const settingRepository = new MockSettingRepository();
      const sut = new ScrollToHomeOperator(presenter, settingRepository);

      await sut.run();

      expect(presenter.getScroll()).toEqual({ x: 0, y: 10 });
    });
  });
});
