import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      const tabPresenter = new MockTabPresenter();
      const currenTab = await tabPresenter.create("https://example.com/");

      const consoleClient = new MockConsoleClient();
      const spy = jest
        .spyOn(consoleClient, "hide")
        .mockResolvedValueOnce(undefined);
      const sut = new CancelOperator(tabPresenter, consoleClient);

      await sut.run();

      expect(spy).toBeCalledWith(currenTab?.id);
    });
  });
});
