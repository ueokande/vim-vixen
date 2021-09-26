import SelectLastTabOperator from "../../../../src/background/operators/impls/SelectLastTabOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";

describe("SelectLastTabOperator", () => {
  describe("#run", () => {
    it("select the rightmost tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });

      const sut = new SelectLastTabOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/3");
    });
  });
});
