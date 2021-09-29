import MockTabPresenter from "../../mock/MockTabPresenter";
import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";

describe("SelectPreviousSelectedTabOperator", () => {
  describe("#run", () => {
    it("select the last-selected tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      jest.spyOn(tabPresenter, "getLastSelectedId").mockResolvedValue(0);

      const sut = new SelectPreviousSelectedTabOperator(tabPresenter);
      await sut.run();

      const url = (await tabPresenter.getCurrent()).url;
      expect(url).toEqual("https://example.com/1");
    });

    it("do nothing if no last-selected tabs", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      jest
        .spyOn(tabPresenter, "getLastSelectedId")
        .mockResolvedValue(undefined);
      const selectSpy = jest.spyOn(tabPresenter, "select");

      const sut = new SelectPreviousSelectedTabOperator(tabPresenter);
      await sut.run();

      expect(selectSpy).not.toBeCalled();
    });
  });
});
