import TabPresenter from '../presenters/TabPresenter';
import BrowserSettingRepository from '../repositories/BrowserSettingRepository';

export default class TabUseCase {
  private tabPresenter: TabPresenter;

  private browserSettingRepository: BrowserSettingRepository;

  constructor() {
    this.tabPresenter = new TabPresenter();
    this.browserSettingRepository = new BrowserSettingRepository();
  }

  async close(force: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    if (!force && tab.pinned) {
      return Promise.resolve();
    }
    return this.tabPresenter.remove([tab.id as number]);
  }

  async closeRight(): Promise<any> {
    let tabs = await this.tabPresenter.getAll();
    tabs.sort((t1, t2) => t1.index - t2.index);
    let index = tabs.findIndex(t => t.active);
    if (index < 0) {
      return;
    }
    for (let i = index + 1; i < tabs.length; ++i) {
      let tab = tabs[i];
      if (!tab.pinned) {
        this.tabPresenter.remove([tab.id as number]);
      }
    }
  }

  reopen(): Promise<any> {
    return this.tabPresenter.reopen();
  }

  async reload(cache: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.reload(tab.id as number, cache);
  }

  async setPinned(pinned: boolean): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id as number, pinned);
  }

  async togglePinned(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id as number, !tab.pinned);
  }

  async duplicate(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.duplicate(tab.id as number);
  }

  async openPageSource(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let url = 'view-source:' + tab.url;
    return this.tabPresenter.create(url);
  }

  async openHome(newTab: boolean): Promise<any> {
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
