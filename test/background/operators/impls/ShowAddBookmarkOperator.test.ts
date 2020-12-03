import sinon from "sinon";
import ShowAddBookmarkOperator from "../../../../src/background/operators/impls/ShowAddBookmarkOperator";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowAddBookmarkOperator", () => {
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
        .withArgs(1, "addbookmark ");

      const sut = new ShowAddBookmarkOperator(
        tabPresenter,
        consoleClient,
        false
      );
      await sut.run();

      mock.verify();
    });

    it("show command with addbookmark command and an URL of the current tab", async () => {
      const tabPresenter = new MockTabPresenter();
      await tabPresenter.create("https://example.com/1", { active: false });
      await tabPresenter.create("https://example.com/2", { active: true });
      await tabPresenter.create("https://example.com/3", { active: false });
      const consoleClient = new MockConsoleClient();
      const mock = sinon
        .mock(consoleClient)
        .expects("showCommand")
        .withArgs(1, "addbookmark welcome, world");

      const sut = new ShowAddBookmarkOperator(
        tabPresenter,
        consoleClient,
        true
      );
      await sut.run();

      mock.verify();
    });
  });
});
