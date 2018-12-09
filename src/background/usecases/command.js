import * as parsers from './parsers';
import * as urls from '../../shared/urls';
import TabPresenter from '../presenters/tab';
import WindowPresenter from '../presenters/window';
import SettingRepository from '../repositories/setting';
import BookmarkRepository from '../repositories/bookmark';
import ConsolePresenter from '../presenters/console';
import ContentMessageClient from '../infrastructures/content-message-client';
import * as properties from 'shared/settings/properties';

export default class CommandIndicator {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.windowPresenter = new WindowPresenter();
    this.settingRepository = new SettingRepository();
    this.bookmarkRepository = new BookmarkRepository();
    this.consolePresenter = new ConsolePresenter();

    this.contentMessageClient = new ContentMessageClient();
  }

  async open(keywords) {
    let url = await this.urlOrSearch(keywords);
    return this.tabPresenter.open(url);
  }

  async tabopen(keywords) {
    let url = await this.urlOrSearch(keywords);
    return this.tabPresenter.create(url);
  }

  async winopen(keywords) {
    let url = await this.urlOrSearch(keywords);
    return this.windowPresenter.create(url);
  }

  // eslint-disable-next-line max-statements
  async buffer(keywords) {
    if (keywords.length === 0) {
      return;
    }

    if (!isNaN(keywords)) {
      let tabs = await this.tabPresenter.getAll();
      let index = parseInt(keywords, 10) - 1;
      if (index < 0 || tabs.length <= index) {
        throw new RangeError(`tab ${index + 1} does not exist`);
      }
      return this.tabPresenter.select(tabs[index].id);
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
        return this.tabPresenter.select(tab.id);
      }
    }
    return this.tabPresenter.select(tabs[0].id);
  }

  async bdelete(force, keywords) {
    let excludePinned = !force;
    let tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    if (tabs.length === 0) {
      throw new Error('No matching buffer for ' + keywords);
    } else if (tabs.length > 1) {
      throw new Error('More than one match for ' + keywords);
    }
    return this.tabPresenter.remove([tabs[0].id]);
  }

  async bdeletes(force, keywords) {
    let excludePinned = !force;
    let tabs = await this.tabPresenter.getByKeyword(keywords, excludePinned);
    let ids = tabs.map(tab => tab.id);
    return this.tabPresenter.remove(ids);
  }

  async quit() {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.remove([tab.id]);
  }

  async quitAll() {
    let tabs = await this.tabPresenter.getAll();
    let ids = tabs.map(tab => tab.id);
    this.tabPresenter.remove(ids);
  }

  async addbookmark(title) {
    let tab = await this.tabPresenter.getCurrent();
    let item = await this.bookmarkRepository.create(title, tab.url);
    let message = 'Saved current page: ' + item.url;
    return this.consolePresenter.showInfo(tab.id, message);
  }

  async set(keywords) {
    if (keywords.length === 0) {
      return;
    }
    let [name, value] = parsers.parseSetOption(keywords, properties.types);
    await this.settingRepository.setProperty(name, value);

    return this.contentMessageClient.broadcastSettingsChanged();
  }

  async urlOrSearch(keywords) {
    let settings = await this.settingRepository.get();
    return urls.searchUrl(keywords, settings.search);
  }
}
