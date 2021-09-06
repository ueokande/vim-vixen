import * as sinon from "sinon";
import MockTabPresenter from "../../mock/MockTabPresenter";
import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";
import MockConsoleClient from "../../mock/MockConsoleClient";
import MockFramePresenter from "../../mock/MockFramePresenter";

describe("FindNextOperator", () => {
  const keyword = "hello";
  const frameIds = [0, 100, 101];

  const tabPresenter = new MockTabPresenter();
  const findRepository = new MockFindRepository();
  const findClient = new MockFindClient();
  const consoleClient = new MockConsoleClient();
  const framePresenter = new MockFramePresenter();
  const sut = new FindNextOperator(
    tabPresenter,
    findRepository,
    findClient,
    consoleClient,
    framePresenter
  );

  let currentTabId: number;

  beforeEach(async () => {
    sinon.restore();

    const currentTab = await tabPresenter.create("https://example.com/", {
      active: true,
    });
    currentTabId = currentTab.id!;
  });

  describe("#run", () => {
    it("shows errors if no previous keywords", async () => {
      sinon
        .stub(findRepository, "getLocalState")
        .returns(Promise.resolve(undefined));

      const mock = sinon.mock(consoleClient);
      mock
        .expects("showError")
        .withArgs(currentTabId, "No previous search keywords");

      await sut.run();

      mock.verify();
    });

    it("continues a search on the same frame", async () => {
      sinon.stub(findRepository, "getLocalState").returns(
        Promise.resolve({
          keyword,
          frameIds,
          framePos: 1,
        })
      );

      const mockFindClient = sinon.mock(findClient);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(true));

      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameIds, framePos: 1 });

      await sut.run();

      mockFindRepository.verify();
      mockFindClient.verify();
    });

    it("continues a search on next frame", async () => {
      sinon.stub(findRepository, "getLocalState").returns(
        Promise.resolve({
          keyword,
          frameIds,
          framePos: 1,
        })
      );

      const mockFindClient = sinon.mock(findClient);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("clearSelection")
        .withArgs(currentTabId, 100)
        .returns(Promise.resolve());
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 101, keyword)
        .returns(Promise.resolve(true));

      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameIds, framePos: 2 });

      await sut.run();

      mockFindRepository.verify();
      mockFindClient.verify();
    });

    it("exercise a wrap-search", async () => {
      sinon.stub(findRepository, "getLocalState").returns(
        Promise.resolve({
          keyword,
          frameIds,
          framePos: 2,
        })
      );

      const mockFindClient = sinon.mock(findClient);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 101, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("clearSelection")
        .withArgs(currentTabId, 101)
        .returns(Promise.resolve());
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(true));

      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameIds, framePos: 0 });

      await sut.run();

      mockFindRepository.verify();
      mockFindClient.verify();
    });

    it("starts a search with last keywords", async () => {
      sinon
        .stub(findRepository, "getLocalState")
        .returns(Promise.resolve(undefined));
      sinon
        .stub(findRepository, "getGlobalKeyword")
        .returns(Promise.resolve(keyword));
      sinon
        .stub(framePresenter, "getAllFrameIds")
        .returns(Promise.resolve(frameIds));
      sinon.stub(consoleClient, "showInfo").returns(Promise.resolve());

      const mockFindClient = sinon.mock(findClient);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 0);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 100);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 101);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(true));

      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameIds, framePos: 0 });

      await sut.run();

      mockFindRepository.verify();
      mockFindClient.verify();
    });
  });
});