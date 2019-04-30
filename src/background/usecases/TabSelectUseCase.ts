import TabPresenter from '../presenters/TabPresenter';

export default class TabSelectUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
  }

  async selectPrev(count) {
    let tabs = await this.tabPresenter.getAll();
    if (tabs.length < 2) {
      return;
    }
    let tab = tabs.find(t => t.active);
    if (!tab) {
      return;
    }
    let select = (tab.index - count + tabs.length) % tabs.length;
    return this.tabPresenter.select(tabs[select].id);
  }

  async selectNext(count) {
    let tabs = await this.tabPresenter.getAll();
    if (tabs.length < 2) {
      return;
    }
    let tab = tabs.find(t => t.active);
    if (!tab) {
      return;
    }
    let select = (tab.index + count) % tabs.length;
    return this.tabPresenter.select(tabs[select].id);
  }

  async selectFirst() {
    let tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[0].id);
  }

  async selectLast() {
    let tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[tabs.length - 1].id);
  }

  async selectPrevSelected() {
    let tabId = await this.tabPresenter.getLastSelectedId();
    if (tabId === null || typeof tabId === 'undefined') {
      return;
    }
    this.tabPresenter.select(tabId);
  }
}
