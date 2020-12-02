import "reflect-metadata";
import TabPresenter from "../../../src/background/presenters/TabPresenter";
import NavigateUseCase from "../../../src/background/usecases/NavigateUseCase";
import NavigateClient, {
  NavigateClientImpl,
} from "../../../src/background/clients/NavigateClient";
import * as sinon from "sinon";

class MockTabPresenter implements TabPresenter {
  create(_url: string, _opts?: unknown): Promise<browser.tabs.Tab> {
    throw new Error("not implemented");
  }

  duplicate(_id: number): Promise<browser.tabs.Tab> {
    throw new Error("not implemented");
  }

  getAll(): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented");
  }

  getByKeyword(
    _keyword: string,
    _excludePinned: boolean
  ): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented");
  }

  getCurrent(): Promise<browser.tabs.Tab> {
    throw new Error("not implemented");
  }

  getLastSelectedId(): Promise<number | undefined> {
    throw new Error("not implemented");
  }

  getZoom(_tabId: number): Promise<number> {
    throw new Error("not implemented");
  }

  onSelected(
    _listener: (arg: { tabId: number; windowId: number }) => void
  ): void {
    throw new Error("not implemented");
  }

  open(_url: string, _tabId?: number): Promise<browser.tabs.Tab> {
    throw new Error("not implemented");
  }

  reload(_tabId: number, _cache: boolean): Promise<void> {
    throw new Error("not implemented");
  }

  remove(_ids: number[]): Promise<void> {
    throw new Error("not implemented");
  }

  reopen(): Promise<void> {
    throw new Error("not implemented");
  }

  select(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  setPinned(_tabId: number, _pinned: boolean): Promise<void> {
    throw new Error("not implemented");
  }

  setZoom(_tabId: number, _factor: number): Promise<void> {
    throw new Error("not implemented");
  }
}

describe("NavigateUseCase", () => {
  let sut: NavigateUseCase;
  let tabPresenter: TabPresenter;
  let navigateClient: NavigateClient;

  beforeEach(() => {
    tabPresenter = new MockTabPresenter();
    navigateClient = new NavigateClientImpl();
    sut = new NavigateUseCase(tabPresenter, navigateClient);
  });

  const newTab = (url: string): browser.tabs.Tab => {
    return {
      index: 0,
      title: "dummy title",
      url: url,
      active: true,
      hidden: false,
      highlighted: false,
      incognito: false,
      isArticle: false,
      isInReaderMode: false,
      lastAccessed: 1585446733000,
      pinned: false,
      selected: false,
      windowId: 0,
    };
  };

  describe("#openParent()", async () => {
    it("opens parent directory of file", async () => {
      sinon
        .stub(tabPresenter, "getCurrent")
        .returns(
          Promise.resolve(newTab("https://google.com/fruits/yellow/banana"))
        );

      const mock = sinon
        .mock(tabPresenter)
        .expects("open")
        .withArgs("https://google.com/fruits/yellow/");

      await sut.openParent();

      mock.verify();
    });

    it("opens parent directory of directory", async () => {
      sinon
        .stub(tabPresenter, "getCurrent")
        .returns(Promise.resolve(newTab("https://google.com/fruits/yellow/")));

      const mock = sinon
        .mock(tabPresenter)
        .expects("open")
        .withArgs("https://google.com/fruits/");

      await sut.openParent();

      mock.verify();
    });

    it("removes hash", async () => {
      sinon
        .stub(tabPresenter, "getCurrent")
        .returns(Promise.resolve(newTab("https://google.com/#top")));

      const mock = sinon
        .mock(tabPresenter)
        .expects("open")
        .withArgs("https://google.com/");

      await sut.openParent();

      mock.verify();
    });

    it("removes search query", async () => {
      sinon
        .stub(tabPresenter, "getCurrent")
        .returns(Promise.resolve(newTab("https://google.com/search?q=apple")));

      const mock = sinon
        .mock(tabPresenter)
        .expects("open")
        .withArgs("https://google.com/search");

      await sut.openParent();

      mock.verify();
    });
  });

  describe("#openRoot()", () => {
    it("opens root direectory", async () => {
      sinon
        .stub(tabPresenter, "getCurrent")
        .returns(Promise.resolve(newTab("https://google.com/seach?q=apple")));

      const mock = sinon
        .mock(tabPresenter)
        .expects("open")
        .withArgs("https://google.com");

      await sut.openRoot();

      mock.verify();
    });
  });
});
