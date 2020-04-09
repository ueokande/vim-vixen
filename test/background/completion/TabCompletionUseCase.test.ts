import "reflect-metadata"
import TabRepositoryImpl from "../../../src/background/completion/impl/TabRepositoryImpl";
import {Tab} from "../../../src/background/completion/TabRepository";
import TabPresenter from "../../../src/background/presenters/TabPresenter";
import TabCompletionUseCase from "../../../src/background/completion/TabCompletionUseCase";
import sinon from 'sinon';
import { expect } from 'chai';
import TabFlag from "../../../src/shared/TabFlag";

class MockTabRepository implements TabRepositoryImpl {
  async queryTabs(_query: string, _excludePinned: boolean): Promise<Tab[]> {
    throw new Error("not implemented")
  }

  async getAllTabs(_excludePinned: boolean): Promise<Tab[]> {
    throw new Error("not implemented")
  }
}

class MockTabPresenter implements TabPresenter {
  create(_url: string, _opts?: object): Promise<browser.tabs.Tab> {
    throw new Error("not implemented")
  }

  duplicate(_id: number): Promise<browser.tabs.Tab> {
    throw new Error("not implemented")
  }

  getAll(): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented")
  }

  getByKeyword(_keyword: string, _excludePinned: boolean): Promise<browser.tabs.Tab[]> {
    throw new Error("not implemented")
  }

  getCurrent(): Promise<browser.tabs.Tab> {
    throw new Error("not implemented")
  }

  getLastSelectedId(): Promise<number | undefined> {
    throw new Error("not implemented")
  }

  getZoom(_tabId: number): Promise<number> {
    throw new Error("not implemented")
  }

  onSelected(_listener: (arg: { tabId: number; windowId: number }) => void): void {
    throw new Error("not implemented")
  }

  open(_url: string, _tabId?: number): Promise<browser.tabs.Tab> {
    throw new Error("not implemented")
  }

  reload(_tabId: number, _cache: boolean): Promise<void> {
    throw new Error("not implemented")
  }

  remove(_ids: number[]): Promise<void> {
    throw new Error("not implemented")
  }

  reopen(): Promise<any> {
    throw new Error("not implemented")
  }

  select(_tabId: number): Promise<void> {
    throw new Error("not implemented")
  }

  setPinned(_tabId: number, _pinned: boolean): Promise<void> {
    throw new Error("not implemented")
  }

  setZoom(_tabId: number, _factor: number): Promise<void> {
    throw new Error("not implemented")
  }
}

describe('TabCompletionUseCase', () => {
  let tabRepository: MockTabRepository;
  let tabPresenter: TabPresenter;
  let sut: TabCompletionUseCase;

  beforeEach(() => {
    tabRepository = new MockTabRepository();
    tabPresenter = new MockTabPresenter();
    sut = new TabCompletionUseCase(tabRepository, tabPresenter);

    sinon.stub(tabPresenter, 'getLastSelectedId').returns(Promise.resolve(12));
    sinon.stub(tabRepository, 'getAllTabs').returns(Promise.resolve([
      { id: 10, index: 0, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', active: false },
      { id: 11, index: 1, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', active: true },
      { id: 12, index: 2, title: 'Bing', url: 'https://bing.com/', active: false },
    ]));
  });

  describe('#queryTabs', () => {
    it("returns tab items", async () => {
      sinon.stub(tabRepository, 'queryTabs').withArgs('', false).returns(Promise.resolve([
        { id: 10, index: 0, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', active: false },
        { id: 11, index: 1, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', active: true },
        { id: 12, index: 2, title: 'Bing', url: 'https://bing.com/', active: false },
      ])).withArgs('oo', false).returns(Promise.resolve([
        { id: 10, index: 0, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', active: false },
        { id: 11, index: 1, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', active: true },
      ]));

      expect(await sut.queryTabs('', false)).to.deep.equal([
        { index: 1, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', flag: TabFlag.None },
        { index: 2, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', flag: TabFlag.CurrentTab },
        { index: 3, title: 'Bing', url: 'https://bing.com/', faviconUrl: undefined, flag: TabFlag.LastTab },
      ]);

      expect(await sut.queryTabs('oo', false)).to.deep.equal([
        { index: 1, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', flag: TabFlag.None },
        { index: 2, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', flag: TabFlag.CurrentTab },
      ]);
    });

    it("returns a tab by the index", async () => {
      expect(await sut.queryTabs('1', false)).to.deep.equal([
        { index: 1, title: 'Google', url: 'https://google.com/', faviconUrl: 'https://google.com/favicon.ico', flag: TabFlag.None },
      ]);

      expect(await sut.queryTabs('10', false)).to.be.empty;
      expect(await sut.queryTabs('-1', false)).to.be.empty;
    });

    it("returns the current tab by % flag", async () => {
      expect(await sut.queryTabs('%', false)).to.deep.equal([
        { index: 2, title: 'Yahoo', url: 'https://yahoo.com/', faviconUrl: 'https://yahoo.com/favicon.ico', flag: TabFlag.CurrentTab },
      ]);
    });

    it("returns the current tab by # flag", async () => {
      expect(await sut.queryTabs('#', false)).to.deep.equal([
        { index: 3, title: 'Bing', url: 'https://bing.com/', faviconUrl: undefined, flag: TabFlag.LastTab },
      ]);
    })
  });
});