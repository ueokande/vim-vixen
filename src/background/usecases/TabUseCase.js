import TabPresenter from '../presenters/TabPresenter';
import BrowserSettingRepository from '../repositories/BrowserSettingRepository';

export default class TabUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.browserSettingRepository = new BrowserSettingRepository();
  }

  async close(force) {
    let tab = await this.tabPresenter.getCurrent();
    if (!force && tab.pinned) {
      return;
    }
    return this.tabPresenter.remove([tab.id]);
  }

  async closeRight() {
    let tabs = await this.tabPresenter.getAll();
    tabs.sort((t1, t2) => t1.index - t2.index);
    let index = tabs.findIndex(t => t.active);
    if (index < 0) {
      return;
    }
    for (let i = index + 1; i < tabs.length; ++i) {
      let tab = tabs[i];
      if (!tab.pinned) {
        this.tabPresenter.remove(tab.id);
      }
    }
  }

  reopen() {
    return this.tabPresenter.reopen();
  }

  async reload(cache) {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.reload(tab.id, cache);
  }

  async setPinned(pinned) {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id, pinned);
  }

  async togglePinned() {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id, !tab.pinned);
  }

  async duplicate() {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.duplicate(tab.id);
  }

  async openPageSource() {
    let tab = await this.tabPresenter.getCurrent();
    let url = 'view-source:' + tab.url;
    return this.tabPresenter.create(url);
  }

  async openHome(newTab) {
    let tab = await this.tabPresenter.getCurrent();
    let urls = await this.browserSettingRepository.getHomepageUrls();
    if (urls.length === 1 && urls[0] === 'about:home') {
      // eslint-disable-next-line max-len
      throw new Error('Cannot open Firefox Home (about:home) by WebExtensions, set your custom URLs');
    }
    if (urls.length === 1 && !newTab) {
      return this.tabPresenter.open(urls[0], tab.id);
    }
    for (let url of urls) {
      this.tabPresenter.create(url);
    }
  }
}
