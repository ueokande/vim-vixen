import sinon from "sinon";
import MockTabPresenter from "../../mock/MockTabPresenter";
import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import { FindState } from "../../../../src/background/repositories/FindRepository";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("FindNextOperator", () => {
  describe("#run", () => {
    it("throws an error on no previous keywords", async () => {
      const tabPresenter = new MockTabPresenter();
      const findRepository = new MockFindRepository();
      const findClient = new MockFindClient();
      const consoleClient = new MockConsoleClient();
      await tabPresenter.create("https://example.com/");

      const sut = new FindNextOperator(
        tabPresenter,
        findRepository,
        findClient,
        consoleClient
      );
      try {
        await sut.run();
      } catch (e) {
        return;
      }
      throw new Error("unexpected reach");
    });

    it("select a next next", async () => {
      const tabPresenter = new MockTabPresenter();
      const findRepository = new MockFindRepository();
      const findClient = new MockFindClient();
      const consoleClient = new MockConsoleClient();
      const currentTab = await tabPresenter.create("https://example.com/");

      const state: FindState = {
        keyword: "Hello, world",
        rangeData: [
          {
            framePos: 0,
            startOffset: 0,
            endOffset: 10,
            startTextNodePos: 0,
            endTextNodePos: 0,
            text: "Hello, world",
          },
          {
            framePos: 1,
            startOffset: 0,
            endOffset: 10,
            startTextNodePos: 1,
            endTextNodePos: 1,
            text: "Hello, world",
          },
          {
            framePos: 2,
            startOffset: 2,
            endOffset: 10,
            startTextNodePos: 1,
            endTextNodePos: 1,
            text: "Hello, world",
          },
        ],
        highlightPosition: 0,
      };

      await findRepository.setLocalState(currentTab.id!, state);
      const mockFindClient = sinon.mock(findClient);
      mockFindClient
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[1]);
      mockFindClient
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[2]);
      mockFindClient
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[0]);
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTab?.id, "2 of 3 matched: Hello, world");
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTab?.id, "3 of 3 matched: Hello, world");
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTab?.id, "1 of 3 matched: Hello, world");
      const sut = new FindNextOperator(
        tabPresenter,
        findRepository,
        findClient,
        consoleClient
      );

      await sut.run();
      await sut.run();
      await sut.run();

      mockConsoleClient.verify();
      mockFindClient.verify();
    });
  });
});
