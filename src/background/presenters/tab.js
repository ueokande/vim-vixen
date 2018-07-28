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

  async selectAt(index) {
    let tabs = await browser.tabs.query({ currentWindow: true });
    if (tabs.length < 2) {
      return;
    }
    if (index < 0 || tabs.length <= index) {
      throw new RangeError(`tab ${index + 1} does not exist`);
    }
    let id = tabs[index].id;
    return browser.tabs.update(id, { active: true });
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

  async createAdjacent(url, { openerTabId, active }) {
    let tabs = await browser.tabs.query({
      active: true, currentWindow: true
    });
    return browser.tabs.create({
      url,
      openerTabId,
      active,
      index: tabs[0].index + 1
    });
  }

  onSelected(listener) {
    browser.tabs.onActivated.addListener(listener);
  }
}
