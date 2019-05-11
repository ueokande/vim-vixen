import MemoryStorage from '../infrastructures/MemoryStorage';

const CURRENT_SELECTED_KEY = 'tabs.current.selected';
const LAST_SELECTED_KEY = 'tabs.last.selected';

type Tab = browser.tabs.Tab;

export default class TabPresenter {
  open(url: string, tabId?: number): Promise<Tab> {
    return browser.tabs.update(tabId, { url });
  }

  create(url: string, opts?: object): Promise<Tab> {
    return browser.tabs.create({ url, ...opts });
  }

  async getCurrent(): Promise<Tab> {
    let tabs = await browser.tabs.query({
      active: true, currentWindow: true
    });
    return tabs[0];
  }

  getAll(): Promise<Tab[]> {
    return browser.tabs.query({ currentWindow: true });
  }

  async getLastSelectedId(): Promise<number | undefined> {
    let cache = new MemoryStorage();
    let tabId = await cache.get(LAST_SELECTED_KEY);
    if (tabId === null || typeof tabId === 'undefined') {
      return;
    }
    return tabId;
  }

  async getByKeyword(keyword: string, excludePinned = false): Promise<Tab[]> {
    let tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return t.url && t.url.toLowerCase().includes(keyword.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keyword.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  }

  select(tabId: number): Promise<Tab> {
    return browser.tabs.update(tabId, { active: true });
  }

  remove(ids: number[]): Promise<void> {
    return browser.tabs.remove(ids);
  }

  async reopen(): Promise<any> {
    let window = await browser.windows.getCurrent();
    let sessions = await browser.sessions.getRecentlyClosed();
    let session = sessions.find((s) => {
      return s.tab && s.tab.windowId === window.id;
    });
    if (!session) {
      return;
    }
    if (session.tab && session.tab.sessionId) {
      return browser.sessions.restore(session.tab.sessionId);
    }
    if (session.window && session.window.sessionId) {
      return browser.sessions.restore(session.window.sessionId);
    }
  }

  reload(tabId: number, cache: boolean): Promise<void> {
    return browser.tabs.reload(tabId, { bypassCache: cache });
  }

  setPinned(tabId: number, pinned: boolean): Promise<Tab> {
    return browser.tabs.update(tabId, { pinned });
  }

  duplicate(id: number): Promise<Tab> {
    return browser.tabs.duplicate(id);
  }

  getZoom(tabId: number): Promise<number> {
    return browser.tabs.getZoom(tabId);
  }

  setZoom(tabId: number, factor: number): Promise<void> {
    return browser.tabs.setZoom(tabId, factor);
  }

  onSelected(
    listener: (arg: { tabId: number, windowId: number}) => void,
  ): void {
    browser.tabs.onActivated.addListener(listener);
  }
}

let tabPresenter = new TabPresenter();
tabPresenter.onSelected((tab: any) => {
  let cache = new MemoryStorage();

  let lastId = cache.get(CURRENT_SELECTED_KEY);
  if (lastId) {
    cache.set(LAST_SELECTED_KEY, lastId);
  }
  cache.set(CURRENT_SELECTED_KEY, tab.tabId);
});
