import sinon from "sinon";
import ShowBufferCommandOperator from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowBufferCommandOperator", () => {
  describe("#run", () => {
    it("show command with buffer command", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "buffer ");

      const sut = new ShowBufferCommandOperator(tabPresenter, consoleClient);
      await sut.run();

      mock.verify();
    });
  });
});
