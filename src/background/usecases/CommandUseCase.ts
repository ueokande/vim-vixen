import { injectable, inject } from "tsyringe";
import * as operations from "../../shared/operations";
import * as parsers from "./parsers";
import * as urls from "../../shared/urls";
import TabPresenter from "../presenters/TabPresenter";
import WindowPresenter from "../presenters/WindowPresenter";
import HelpPresenter from "../presenters/HelpPresenter";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import BookmarkRepository from "../repositories/BookmarkRepository";
import ConsoleClient from "../infrastructures/ConsoleClient";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import RepeatUseCase from "../usecases/RepeatUseCase";

@injectable()
export default class CommandUseCase {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("WindowPresenter")
    private readonly windowPresenter: WindowPresenter,
    private readonly helpPresenter: HelpPresenter,
    @inject("CachedSettingRepository")
    private readonly cachedSettingRepository: CachedSettingRepository,
    private readonly bookmarkRepository: BookmarkRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    private readonly contentMessageClient: ContentMessageClient,
    private readonly repeatUseCase: RepeatUseCase
  ) {}

  async open(keywords: string): Promise<browser.tabs.Tab> {
    const url = await this.urlOrSearch(keywords);
    this.repeatUseCase.storeLastOperation({
      type: operations.INTERNAL_OPEN_URL,
      url,
    });
    return this.tabPresenter.open(url);
  }

  async tabopen(keywords: string): Promise<browser.tabs.Tab> {
    const url = await this.urlOrSearch(keywords);
    this.repeatUseCase.storeLastOperation({
      type: operations.INTERNAL_OPEN_URL,
      url,
      newTab: true,
    });
    return this.tabPresenter.create(url);
  }

  async winopen(keywords: string): Promise<void> {
    const url = await this.urlOrSearch(keywords);
    this.repeatUseCase.storeLastOperation({
      type: operations.INTERNAL_OPEN_URL,
      url,
      newWindow: true,
    });
    return this.windowPresenter.create(url);
  }

  // eslint-disable-next-line max-statements
  async buffer(keywords: string): Promise<any> {
    if (keywords.length === 0) {
      return;
    }

    if (!isNaN(Number(keywords))) {
      const tabs = await this.tabPresenter.getAll();
      const index = parseInt(keywords, 10) - 1;
      if (index < 0 || tabs.length <= index) {
        throw new RangeError(`tab ${index + 1} does not exist`);
      }
      return this.tabPresenter.select(tabs[index].id as number);
    } else if (keywords.trim() === "%") {
      // Select current window
      return;
    } else if (keywords.trim() === "#") {
      // Select last selected window
      const lastId = await this.tabPresenter.getLastSelectedId();
      if (typeof lastId === "undefined" || lastId === null) {
        throw new Error("No last selected tab");
      }
      return this.tabPresenter.select(lastId);
    }

    const current = await this.tabPresenter.getCurrent();
    const tabs = await this.tabPresenter.getByKeyword(keywords, false);
    if (tabs.length === 0) {
      throw new RangeError("No matching buffer for " + keywords);
    }
    for (const tab of tabs) {
      if (tab.index > current.index) {
        return this.tabPresenter.select(tab.id as number);
      }
    }
    return this.tabPresenter.select(tabs[0].id as number);
  }

  async bdelete(force: boolean, keywords: string): Promise<any> {
    const excludePinned = !force;
    const tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    } else if (tabs.length > 1) {
      throw new Error("More than one match for " + keywords);
    }
    return this.tabPresenter.remove([tabs[0].id as number]);
  }

  async bdeletes(force: boolean, keywords: string): Promise<any> {
    const excludePinned = !force;
    const tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    const ids = tabs.map((tab) => tab.id as number);
    return this.tabPresenter.remove(ids);
  }

  async quit(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.remove([tab.id as number]);
  }

  async quitAll(): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    const ids = tabs.map((tab) => tab.id as number);
    this.tabPresenter.remove(ids);
  }

  async addbookmark(title: string): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const item = await this.bookmarkRepository.create(title, tab.url as string);
    const message = "Saved current page: " + item.url;
    return this.consoleClient.showInfo(tab.id as number, message);
  }

  async set(keywords: string): Promise<any> {
    if (keywords.length === 0) {
      return;
    }
    const [name, value] = parsers.parseSetOption(keywords);
    await this.cachedSettingRepository.setProperty(name, value);

    return this.contentMessageClient.broadcastSettingsChanged();
  }

  help(): Promise<void> {
    return this.helpPresenter.open();
  }

  private async urlOrSearch(keywords: string): Promise<any> {
    const settings = await this.cachedSettingRepository.get();
    return urls.searchUrl(keywords, settings.search);
  }
}
