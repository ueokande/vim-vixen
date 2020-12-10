import sinon from "sinon";
import ShowCommandOperator from "../../../../src/background/operators/impls/ShowCommandOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowCommandOperator", () => {
  describe("#run", () => {
    it("show command with addbookmark command", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "");

      const sut = new ShowCommandOperator(tabPresenter, consoleClient);
      await sut.run();

      mock.verify();
    });
  });
});
