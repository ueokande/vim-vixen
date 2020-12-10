import sinon from "sinon";
import ShowTabOpenCommandOperator from "../../../../src/background/operators/impls/ShowTabOpenCommandOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowTabOpenCommandOperator", () => {
  describe("#run", () => {
    it("show command with tabopen command", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "tabopen ");

      const sut = new ShowTabOpenCommandOperator(
        tabPresenter,
        consoleClient,
        false
      );
      await sut.run();

      mock.verify();
    });

    it("show command with tabopen command and an URL of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "tabopen https://example.com/2");

      const sut = new ShowTabOpenCommandOperator(
        tabPresenter,
        consoleClient,
        true
      );
      await sut.run();

      mock.verify();
    });
  });
});
