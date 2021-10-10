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

  const getFrameIdsSpy = jest
    .spyOn(frameRepository, "getFrameIds")
    .mockResolvedValue(frameIds);
  const clearSelectionSpy = jest
    .spyOn(findClient, "clearSelection")
    .mockReturnValue(Promise.resolve());
  const findNextSpy = jest.spyOn(findClient, "findNext");
  const setLocalStateSpy = jest
    .spyOn(findRepository, "setLocalState")
    .mockReturnValue(Promise.resolve());

  beforeEach(async () => {
    getFrameIdsSpy.mockClear();
    clearSelectionSpy.mockClear();
    findNextSpy.mockClear();
    setLocalStateSpy.mockClear();
  });

  describe("startFind", () => {
    it("starts a find with a keyword", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(currentTabId, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(setLocalStateSpy).toBeCalledWith(currentTabId, {
        keyword,
        frameId: 100,
      });
      expect(showInfoSpy).toBeCalledWith(
        currentTabId,
        "Pattern found: " + keyword
      );
    });

    it("starts a find with last local state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue({ keyword, frameId: 0 });
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(currentTabId, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(currentTabId);
      expect(setLocalStateSpy).toBeCalledWith(currentTabId, {
        keyword,
        frameId: 100,
      });
      expect(showInfoSpy).toBeCalledWith(
        currentTabId,
        "Pattern found: " + keyword
      );
    });

    it("starts a find with last global state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(currentTabId, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(currentTabId);
      expect(setLocalStateSpy).toBeCalledWith(currentTabId, {
        keyword,
        frameId: 100,
      });
      expect(showInfoSpy).toBeCalledWith(
        currentTabId,
        "Pattern found: " + keyword
      );
    });

    it("shows an error when pattern not found", async () => {
      findNextSpy.mockResolvedValue(false);
      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(currentTabId, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(setLocalStateSpy).not.toBeCalled();
      expect(showErrorSpy).toBeCalledWith(
        currentTabId,
        "Pattern not found: " + keyword
      );
    });

    it("shows an error when no last keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      jest
        .spyOn(findRepository, "getGlobalKeyword")
        .mockResolvedValue(undefined);

      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(currentTabId, undefined);

      expect(showErrorSpy).toBeCalledWith(
        currentTabId,
        "No previous search keywords"
      );
    });
  });
});
