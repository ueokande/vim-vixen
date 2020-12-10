import sinon from "sinon";
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
      const mock = sinon.mock(consoleClient).expects("showFind").withArgs(1);

      const sut = new StartFindOperator(tabPresenter, consoleClient);
      await sut.run();

      mock.verify();
    });
  });
});
