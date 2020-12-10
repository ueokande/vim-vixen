import sinon from "sinon";
import ShowOpenCommandOperator from "../../../../src/background/operators/impls/ShowOpenCommandOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowOpenCommandOperator", () => {
  describe("#run", () => {
    it("show command with open command", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "open ");

      const sut = new ShowOpenCommandOperator(
        tabPresenter,
        consoleClient,
        false
      );
      await sut.run();

      mock.verify();
    });

    it("show command with open command and an URL of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "open https://example.com/2");

      const sut = new ShowOpenCommandOperator(
        tabPresenter,
        consoleClient,
        true
      );
      await sut.run();

      mock.verify();
    });
  });
});
