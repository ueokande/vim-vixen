import TabPresenter from '../presenters/tab';
import ConsolePresenter from '../presenters/console';
import * as urls from '../../shared/urls';

const ZOOM_SETTINGS = [
  0.33, 0.50, 0.66, 0.75, 0.80, 0.90, 1.00,
  1.10, 1.25, 1.50, 1.75, 2.00, 2.50, 3.00
];

export default class OperationInteractor {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.consolePresenter = new ConsolePresenter();
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
      this.tabPresenter.remove(tabs[i].id);
    }
  }

  reopen() {
    return this.tabPresenter.reopen();
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

  async zoomIn(tabId) {
    let tab = await this.tabPresenter.getCurrent();
    let current = await this.tabPresenter.getZoom(tab.id);
    let factor = ZOOM_SETTINGS.find(f => f > current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId, factor);
    }
  }

  async zoomOut(tabId) {
    let tab = await this.tabPresenter.getCurrent();
    let current = await this.tabPresenter.getZoom(tab.id);
    let factor = [].concat(ZOOM_SETTINGS).reverse().find(f => f < current);
    if (factor) {
      return this.tabPresenter.setZoom(tabId, factor);
    }
  }

  zoomNutoral(tabId) {
    return this.tabPresenter.setZoom(tabId, 1);
  }

  async showCommand() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consolePresenter.showCommand(tab.id, '');
  }

  async showOpenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'open ';
    if (alter) {
      command += tab.url;
    }
    return this.consolePresenter.showCommand(tab.id, command);
  }

  async showTabopenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'tabopen ';
    if (alter) {
      command += tab.url;
    }
    return this.consolePresenter.showCommand(tab.id, command);
  }

  async showWinopenCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'winopen ';
    if (alter) {
      command += tab.url;
    }
    return this.consolePresenter.showCommand(tab.id, command);
  }

  async showBufferCommand() {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'buffer ';
    return this.consolePresenter.showCommand(tab.id, command);
  }

  async showAddbookmarkCommand(alter) {
    let tab = await this.tabPresenter.getCurrent();
    let command = 'addbookmark ';
    if (alter) {
      command += tab.title;
    }
    return this.consolePresenter.showCommand(tab.id, command);
  }

  async findStart() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consolePresenter.showFind(tab.id);
  }

  async hideConsole() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consolePresenter.hide(tab.id);
  }

  async openHome(newTab) {
    let tab = await this.tabPresenter.getCurrent();
    let result = await browser.browserSettings.homepageOverride.get({});
    let us = urls.homepageUrls(result.value);
    if (us.length === 1 && !newTab) {
      return this.tabPresenter.open(us[0], tab.id);
    }
    for (let u of us) {
      this.tabPresenter.create(u, { openerTabId: tab.id });
    }
  }
}

