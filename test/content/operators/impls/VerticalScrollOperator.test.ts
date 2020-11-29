import { expect } from "chai";
import VerticalScrollOperator from "../../../../src/content/operators/impls/VerticalScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("VerticalScrollOperator", () => {
  describe("#run", () => {
    it("scroll vertically", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new VerticalScrollOperator(presenter, settingRepository, 1);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 0, y: 1 });
    });

    it("scroll vertically with repeats", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new VerticalScrollOperator(presenter, settingRepository, 5);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 0, y: 5 });
    });
  });
});
