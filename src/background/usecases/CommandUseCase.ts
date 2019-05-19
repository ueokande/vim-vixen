import { injectable } from 'tsyringe';
import * as parsers from './parsers';
import * as urls from '../../shared/urls';
import TabPresenter from '../presenters/TabPresenter';
import WindowPresenter from '../presenters/WindowPresenter';
import SettingRepository from '../repositories/SettingRepository';
import BookmarkRepository from '../repositories/BookmarkRepository';
import ConsoleClient from '../infrastructures/ConsoleClient';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

@injectable()
export default class CommandIndicator {
  constructor(
    private tabPresenter: TabPresenter,
    private windowPresenter: WindowPresenter,
    private settingRepository: SettingRepository,
    private bookmarkRepository: BookmarkRepository,
    private consoleClient: ConsoleClient,
    private contentMessageClient: ContentMessageClient,
  ) {
  }

  async open(keywords: string): Promise<browser.tabs.Tab> {
    let url = await this.urlOrSearch(keywords);
    return this.tabPresenter.open(url);
  }

  async tabopen(keywords: string): Promise<browser.tabs.Tab> {
    let url = await this.urlOrSearch(keywords);
    return this.tabPresenter.create(url);
  }

  async winopen(keywords: string): Promise<browser.windows.Window> {
    let url = await this.urlOrSearch(keywords);
    return this.windowPresenter.create(url);
  }

  // eslint-disable-next-line max-statements
  async buffer(keywords: string): Promise<any> {
    if (keywords.length === 0) {
      return;
    }

    if (!isNaN(Number(keywords))) {
      let tabs = await this.tabPresenter.getAll();
      let index = parseInt(keywords, 10) - 1;
      if (index < 0 || tabs.length <= index) {
        throw new RangeError(`tab ${index + 1} does not exist`);
      }
      return this.tabPresenter.select(tabs[index].id as number);
    } else if (keywords.trim() === '%') {
      // Select current window
      return;
    } else if (keywords.trim() === '#') {
      // Select last selected window
      let lastId = await this.tabPresenter.getLastSelectedId();
      if (typeof lastId === 'undefined' || lastId === null) {
        throw new Error('No last selected tab');
      }
      return this.tabPresenter.select(lastId);
    }

    let current = await this.tabPresenter.getCurrent();
    let tabs = await this.tabPresenter.getByKeyword(keywords);
    if (tabs.length === 0) {
      throw new RangeError('No matching buffer for ' + keywords);
    }
    for (let tab of tabs) {
      if (tab.index > current.index) {
        return this.tabPresenter.select(tab.id as number);
      }
    }
    return this.tabPresenter.select(tabs[0].id as number);
  }

  async bdelete(force: boolean, keywords: string): Promise<any> {
    let excludePinned = !force;
    let tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    if (tabs.length === 0) {
      throw new Error('No matching buffer for ' + keywords);
    } else if (tabs.length > 1) {
      throw new Error('More than one match for ' + keywords);
    }
    return this.tabPresenter.remove([tabs[0].id as number]);
  }

  async bdeletes(force: boolean, keywords: string): Promise<any> {
    let excludePinned = !force;
    let tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    let ids = tabs.map(tab => tab.id as number);
    return this.tabPresenter.remove(ids);
  }

  async quit(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.remove([tab.id as number]);
  }

  async quitAll(): Promise<any> {
    let tabs = await this.tabPresenter.getAll();
    let ids = tabs.map(tab => tab.id as number);
    this.tabPresenter.remove(ids);
  }

  async addbookmark(title: string): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let item = await this.bookmarkRepository.create(title, tab.url as string);
    let message = 'Saved current page: ' + item.url;
    return this.consoleClient.showInfo(tab.id as number, message);
  }

  async set(keywords: string): Promise<any> {
    if (keywords.length === 0) {
      return;
    }
    let [name, value] = parsers.parseSetOption(keywords);
    await this.settingRepository.setProperty(name, value);

    return this.contentMessageClient.broadcastSettingsChanged();
  }

  async urlOrSearch(keywords: string): Promise<any> {
    let settings = await this.settingRepository.get();
    return urls.searchUrl(keywords, settings.search);
  }
}
