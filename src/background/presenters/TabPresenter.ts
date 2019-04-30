import MemoryStorage from '../infrastructures/MemoryStorage';

const CURRENT_SELECTED_KEY = 'tabs.current.selected';
const LAST_SELECTED_KEY = 'tabs.last.selected';

export default class TabPresenter {
  open(url, tabId) {
    return browser.tabs.update(tabId, { url });
  }

  create(url, opts) {
    return browser.tabs.create({ url, ...opts });
  }

  async getCurrent() {
    let tabs = await browser.tabs.query({
      active: true, currentWindow: true
    });
    return tabs[0];
  }

  getAll() {
    return browser.tabs.query({ currentWindow: true });
  }

  async getLastSelectedId() {
    let cache = new MemoryStorage();
    let tabId = await cache.get(LAST_SELECTED_KEY);
    if (tabId === null || typeof tabId === 'undefined') {
      return;
    }
    return tabId;
  }

  async getByKeyword(keyword, excludePinned = false) {
    let tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return t.url.toLowerCase().includes(keyword.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keyword.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  }

  select(tabId) {
    return browser.tabs.update(tabId, { active: true });
  }

  remove(ids) {
    return browser.tabs.remove(ids);
  }

  async reopen() {
    let window = await browser.windows.getCurrent();
    let sessions = await browser.sessions.getRecentlyClosed();
    let session = sessions.find((s) => {
      return s.tab && s.tab.windowId === window.id;
    });
    if (!session) {
      return;
    }
    if (session.tab) {
      return browser.sessions.restore(session.tab.sessionId);
    }
    return browser.sessions.restore(session.window.sessionId);
  }

  reload(tabId, cache) {
    return browser.tabs.reload(tabId, { bypassCache: cache });
  }

  setPinned(tabId, pinned) {
    return browser.tabs.update(tabId, { pinned });
  }

  duplicate(id) {
    return browser.tabs.duplicate(id);
  }

  getZoom(tabId) {
    return browser.tabs.getZoom(tabId);
  }

  setZoom(tabId, factor) {
    return browser.tabs.setZoom(tabId, factor);
  }

  onSelected(listener) {
    browser.tabs.onActivated.addListener(listener);
  }
}

let tabPresenter = new TabPresenter();
tabPresenter.onSelected((tab) => {
  let cache = new MemoryStorage();

  let lastId = cache.get(CURRENT_SELECTED_KEY);
  if (lastId) {
    cache.set(LAST_SELECTED_KEY, lastId);
  }
  cache.set(CURRENT_SELECTED_KEY, tab.tabId);
});
