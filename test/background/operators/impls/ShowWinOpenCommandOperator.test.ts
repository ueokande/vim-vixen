import sinon from "sinon";
import ShowWinOpenCommandOperator from "../../../../src/background/operators/impls/ShowWinOpenCommandOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowWinOpenCommandOperator", () => {
  describe("#run", () => {
    it("show command with winopen command", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "winopen ");

      const sut = new ShowWinOpenCommandOperator(
        tabPresenter,
        consoleClient,
        false
      );
      await sut.run();

      mock.verify();
    });

    it("show command with winopen command and an URL of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "winopen https://example.com/2");

      const sut = new ShowWinOpenCommandOperator(
        tabPresenter,
        consoleClient,
        true
      );
      await sut.run();

      mock.verify();
    });
  });
});
