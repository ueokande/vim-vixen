import PageScrollOperator from "../../../../src/content/operators/impls/PageScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("PageScrollOperator", () => {
  describe("#run", () => {
    it("scroll by a page", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new PageScrollOperator(presenter, settingRepository, 1);

      await sut.run();

      expect(presenter.getScroll()).toEqual({ x: 1, y: 0 });
    });

    it("scroll by a page with repeats", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new PageScrollOperator(presenter, settingRepository, 5);

      await sut.run();

      expect(presenter.getScroll()).toEqual({ x: 5, y: 0 });
    });
  });
});
