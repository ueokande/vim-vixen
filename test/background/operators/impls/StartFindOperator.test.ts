import StartFindOperator from "../../../../src/background/operators/impls/StartFindOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("StartFindOperator", () => {
  describe("#run", () => {
    it("show find console", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const showFindSpy = jest
        .spyOn(consoleClient, "showFind")
        .mockReturnValue(Promise.resolve());

      const sut = new StartFindOperator(tabPresenter, consoleClient);
      await sut.run();

      expect(showFindSpy).toBeCalledWith(1);
    });
  });
});
