import { expect } from "chai";
import HorizontalScrollOperator from "../../../../src/content/operators/impls/HorizontalScrollOperator";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";

describe("HorizontalScrollOperator", () => {
  describe("#run", () => {
    it("scroll horizontally", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new HorizontalScrollOperator(presenter, settingRepository, 1);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 1, y: 0 });
    });

    it("scroll horizontally with repeats", async () => {
      const presenter = new MockScrollPresenter();
      const settingRepository = new MockSettingRepository();
      const sut = new HorizontalScrollOperator(presenter, settingRepository, 5);

      await sut.run();

      expect(presenter.getScroll()).to.deep.equal({ x: 5, y: 0 });
    });
  });
});
