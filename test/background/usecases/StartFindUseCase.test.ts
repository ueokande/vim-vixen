import * as sinon from "sinon";
import MockFindClient from "../mock/MockFindClient";
import MockFindRepository from "../mock/MockFindRepository";
import MockConsoleClient from "../mock/MockConsoleClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import StartFindUseCase from "../../../src/background/usecases/StartFindUseCase";

describe("StartFindUseCase", () => {
  const currentTabId = 100;
  const frameIds = [0, 100, 101];
  const keyword = "hello";

  const findClient = new MockFindClient();
  const findRepository = new MockFindRepository();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const sut = new StartFindUseCase(
    findClient,
    findRepository,
    consoleClient,
    frameRepository
  );

  beforeEach(async () => {
    sinon.restore();

    sinon
      .stub(frameRepository, "getFrameIds")
      .returns(Promise.resolve(frameIds));
  });

  describe("startFind", () => {
    it("starts a find with a keyword", async () => {
      const mockFindClient = sinon.mock(findClient);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 0);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 100);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 101);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(true));
      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameId: 100 });
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTabId, "Pattern found: " + keyword);

      await sut.startFind(currentTabId, keyword);

      mockFindClient.verify();
      mockFindRepository.verify();
      mockConsoleClient.verify();
    });

    it("starts a find with last local state", async () => {
      const mockFindClient = sinon.mock(findClient);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 0);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 100);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 101);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(true));
      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("getLocalState")
        .withArgs(currentTabId)
        .returns(Promise.resolve({ keyword, frameId: 0 }));
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameId: 100 });
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTabId, "Pattern found: " + keyword);

      await sut.startFind(currentTabId, undefined);

      mockFindClient.verify();
      mockFindRepository.verify();
      mockConsoleClient.verify();
    });

    it("starts a find with last global state", async () => {
      const mockFindClient = sinon.mock(findClient);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 0);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 100);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 101);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(true));
      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository
        .expects("getLocalState")
        .withArgs(currentTabId)
        .returns(Promise.resolve(undefined));
      mockFindRepository
        .expects("getGlobalKeyword")
        .returns(Promise.resolve(keyword));
      mockFindRepository
        .expects("setLocalState")
        .withArgs(currentTabId, { keyword, frameId: 100 });
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showInfo")
        .withArgs(currentTabId, "Pattern found: " + keyword);

      await sut.startFind(currentTabId, undefined);

      mockFindClient.verify();
      mockFindRepository.verify();
      mockConsoleClient.verify();
    });

    it("shows an error when pattern not found", async () => {
      const mockFindClient = sinon.mock(findClient);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 0);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 100);
      mockFindClient.expects("clearSelection").withArgs(currentTabId, 101);
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 0, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 100, keyword)
        .returns(Promise.resolve(false));
      mockFindClient
        .expects("findNext")
        .withArgs(currentTabId, 101, keyword)
        .returns(Promise.resolve(false));
      const mockFindRepository = sinon.mock(findRepository);
      mockFindRepository.expects("setLocalState").never();
      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showError")
        .withArgs(currentTabId, "Pattern not found: " + keyword);

      await sut.startFind(currentTabId, keyword);

      mockFindClient.verify();
      mockFindRepository.verify();
      mockConsoleClient.verify();
    });

    it("shows an error when no last keywords", async () => {
      sinon
        .stub(findRepository, "getLocalState")
        .returns(Promise.resolve(undefined));
      sinon
        .stub(findRepository, "getGlobalKeyword")
        .returns(Promise.resolve(undefined));

      const mockConsoleClient = sinon.mock(consoleClient);
      mockConsoleClient
        .expects("showError")
        .withArgs(currentTabId, "No previous search keywords");

      await sut.startFind(currentTabId, undefined);

      mockConsoleClient.verify();
    });
  });
});
