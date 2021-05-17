import sinon from "sinon";
import MockTabPresenter from "../../mock/MockTabPresenter";
import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import { FindState } from "../../../../src/background/repositories/FindRepository";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";

describe("FindPrevOperator", () => {
  describe("#run", () => {
    it("throws an error on no previous keywords", async () => {
      const tabPresenter = new MockTabPresenter();
      const findRepository = new MockFindRepository();
      const findClient = new MockFindClient();
      await tabPresenter.create("https://example.com/");

      const sut = new FindNextOperator(
        tabPresenter,
        findRepository,
        findClient
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
        highlightPosition: 1,
      };

      await findRepository.setLocalState(currentTab.id!, state);
      const mock = sinon.mock(findClient);
      mock
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[0]);
      mock
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[2]);
      mock
        .expects("selectKeyword")
        .withArgs(currentTab?.id, "Hello, world", state.rangeData[1]);
      const sut = new FindNextOperator(
        tabPresenter,
        findRepository,
        findClient
      );

      await sut.run();
      await sut.run();
      await sut.run();

      mock.verify();
    });
  });
});
