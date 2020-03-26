import "reflect-metadata";
import CompletionType from "../../../src/shared/CompletionType";
import BookmarkRepository, {BookmarkItem} from "../../../src/background/completion/BookmarkRepository";
import HistoryRepository, {HistoryItem} from "../../../src/background/completion/HistoryRepository";
import CompletionUseCase from "../../../src/background/completion/CompletionUseCase";
import CachedSettingRepository from "../../../src/background/repositories/CachedSettingRepository";
import Settings, {DefaultSetting} from "../../../src/shared/settings/Settings";
import { expect } from 'chai';
import sinon from 'sinon';
import Properties from "../../../src/shared/settings/Properties";
import Search from "../../../src/shared/settings/Search";

class MockBookmarkRepository implements BookmarkRepository {
  queryBookmarks(_query: string): Promise<BookmarkItem[]> {
    throw new Error("not implemented")
  }
}

class MockHistoryRepository implements HistoryRepository {
  queryHistories(_keywords: string): Promise<HistoryItem[]> {
    throw new Error("not implemented")
  }
}

class MockSettingRepository implements CachedSettingRepository {
  get(): Promise<Settings> {
    throw new Error("not implemented")
  }

  setProperty(_name: string, _value: string | number | boolean): Promise<void> {
    throw new Error("not implemented")
  }

  update(_value: Settings): Promise<void> {
    throw new Error("not implemented")
  }
}

describe('CompletionUseCase', () => {
  let bookmarkRepository: MockBookmarkRepository;
  let historyRepository: MockHistoryRepository;
  let settingRepository: MockSettingRepository;
  let sut: CompletionUseCase;

  beforeEach(() => {
    bookmarkRepository = new MockBookmarkRepository();
    historyRepository = new MockHistoryRepository();
    settingRepository = new MockSettingRepository();
    sut = new CompletionUseCase(bookmarkRepository, historyRepository, settingRepository)
  });

  describe('#getCompletionTypes', () => {
    it("returns completion types from the property", async () => {
      sinon.stub(settingRepository, 'get').returns(Promise.resolve(new Settings({
        keymaps: DefaultSetting.keymaps,
        search: DefaultSetting.search,
        properties: new Properties({ complete: "shb" }),
        blacklist: DefaultSetting.blacklist,
      })));

      const items = await sut.getCompletionTypes();
      expect(items).to.deep.equal([
        CompletionType.SearchEngines,
        CompletionType.History,
        CompletionType.Bookmarks
      ]);
    });
  });

  describe('#requestSearchEngines', () => {
    it("returns search engines matches by the query", async () => {
      sinon.stub(settingRepository, 'get').returns(Promise.resolve(new Settings({
        keymaps: DefaultSetting.keymaps,
        search: new Search("google", {
          "google": "https://google.com/search?q={}",
          "yahoo": "https://search.yahoo.com/search?q={}",
          "bing": "https://bing.com/search?q={}",
          "google_ja": "https://google.co.jp/search?q={}",
        }),
        properties: DefaultSetting.properties,
        blacklist: DefaultSetting.blacklist,
      })));

      expect(await sut.requestSearchEngines("")).to.deep.equal([
        "google",
        "yahoo",
        "bing",
        "google_ja",
      ]);
      expect(await sut.requestSearchEngines("go")).to.deep.equal([
        "google",
        "google_ja",
      ]);
      expect(await sut.requestSearchEngines("x")).to.be.empty;
    })
  });

  describe('#requestBookmarks', () => {
    it("returns bookmarks from the repository", async() => {
      sinon.stub(bookmarkRepository, 'queryBookmarks')
        .withArgs("site").returns(Promise.resolve([
          { title: "site1", url: "https://site1.example.com" },
          { title: "site2", url: "https://site2.example.com/" },
        ]))
        .withArgs("xyz").returns(Promise.resolve([]));

      expect(await sut.requestBookmarks("site")).to.deep.equal([
        { title: "site1", url: "https://site1.example.com" },
        { title: "site2", url: "https://site2.example.com/" },
      ]);
      expect(await sut.requestBookmarks("xyz")).to.be.empty;
    });
  });

  describe('#requestHistory', () => {
    it("returns histories from the repository", async() => {
      sinon.stub(historyRepository, 'queryHistories')
        .withArgs("site").returns(Promise.resolve([
        { title: "site1", url: "https://site1.example.com" },
        { title: "site2", url: "https://site2.example.com/" },
      ]))
        .withArgs("xyz").returns(Promise.resolve([]));

      expect(await sut.requestHistory("site")).to.deep.equal([
        { title: "site1", url: "https://site1.example.com" },
        { title: "site2", url: "https://site2.example.com/" },
      ]);
      expect(await sut.requestHistory("xyz")).to.be.empty;
    });
  });
});