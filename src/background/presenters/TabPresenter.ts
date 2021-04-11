import MemoryStorage from "../infrastructures/MemoryStorage";

const CURRENT_SELECTED_KEY = "tabs.current.selected";
const LAST_SELECTED_KEY = "tabs.last.selected";

type Tab = browser.tabs.Tab;

export default interface TabPresenter {
  open(url: string, tabId?: number): Promise<Tab>;

  create(
    url: string,
    opts?: {
      active?: boolean;
      cookieStoreId?: string;
      index?: number;
      openerTabId?: number;
      pinned?: boolean;
      windowId?: number;
    }
  ): Promise<Tab>;

  getCurrent(): Promise<Tab>;

  getAll(onlyCurrentWin?: boolean): Promise<Tab[]>;

  getLastSelectedId(): Promise<number | undefined>;

  getByKeyword(keyword: string, excludePinned: boolean, onlyCurrentWin?: boolean): Promise<Tab[]>;

  select(tabId: number): Promise<void>;

  remove(ids: number[]): Promise<void>;

  reopen(): Promise<void>;

  reload(tabId: number, cache: boolean): Promise<void>;

  setPinned(tabId: number, pinned: boolean): Promise<void>;

  duplicate(id: number): Promise<Tab>;

  getZoom(tabId: number): Promise<number>;

  setZoom(tabId: number, factor: number): Promise<void>;

  onSelected(
    listener: (arg: { tabId: number; windowId: number }) => void
  ): void;
}

export class TabPresenterImpl implements TabPresenter {
  open(url: string, tabId?: number): Promise<Tab> {
    return browser.tabs.update(tabId, { url });
  }

  create(
    url: string,
    opts?: {
      active?: boolean;
      cookieStoreId?: string;
      index?: number;
      openerTabId?: number;
      pinned?: boolean;
      windowId?: number;
    }
  ): Promise<Tab> {
    return browser.tabs.create({ url, ...opts });
  }

  async getCurrent(): Promise<Tab> {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  }

  getAll(onlyCurrentWin: boolean = true): Promise<Tab[]> {
    return browser.tabs.query({ currentWindow: true })
        .then( res =>
            (onlyCurrentWin ? res : browser.tabs.query({ currentWindow: false })
                .then( res2 => [...res, ...res2])))
  }

  async getLastSelectedId(): Promise<number | undefined> {
    const cache = new MemoryStorage();
    const tabId = await cache.get(LAST_SELECTED_KEY);
    if (tabId === null || typeof tabId === "undefined") {
      return;
    }
    return tabId;
  }

  async getByKeyword(keyword: string, excludePinned = false, onlyCurrentWin: boolean = true): Promise<Tab[]> {
    const tabs = [
        ...await browser.tabs.query({ currentWindow: true }),
      ...(onlyCurrentWin ? [] : await browser.tabs.query({ currentWindow: false }))
    ];
    return tabs
      .filter((t) => {
        return (
          (t.url && t.url.toLowerCase().includes(keyword.toLowerCase())) ||
          (t.title && t.title.toLowerCase().includes(keyword.toLowerCase()))
        );
      })
      .filter((t) => {
        return !(excludePinned && t.pinned);
      });
  }

  async select(tabId: number): Promise<void> {
    await browser.tabs.update(tabId, { active: true });
    const windowId = (await browser.tabs.get(tabId)).windowId;
    if((await browser.windows.getCurrent()).id !== windowId) {
       await browser.windows.update(windowId, {focused: true})
    }
  }

  async remove(ids: number[]): Promise<void> {
    await browser.tabs.remove(ids);
  }

  async reopen(): Promise<void> {
    const window = await browser.windows.getCurrent();
    const sessions = await browser.sessions.getRecentlyClosed();
    const session = sessions.find((s) => {
      return s.tab && s.tab.windowId === window.id;
    });
    if (!session) {
      return;
    }
    if (session.tab && session.tab.sessionId) {
      await browser.sessions.restore(session.tab.sessionId);
    } else if (session.window && session.window.sessionId) {
      await browser.sessions.restore(session.window.sessionId);
    }
  }

  async reload(tabId: number, cache: boolean): Promise<void> {
    await browser.tabs.reload(tabId, { bypassCache: cache });
  }

  async setPinned(tabId: number, pinned: boolean): Promise<void> {
    await browser.tabs.update(tabId, { pinned });
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
    listener: (arg: { tabId: number; windowId: number }) => void
  ): void {
    browser.tabs.onActivated.addListener(listener);
  }
}

const tabPresenter = new TabPresenterImpl();
tabPresenter.onSelected((tab: any) => {
  const cache = new MemoryStorage();

  const lastId = cache.get(CURRENT_SELECTED_KEY);
  if (lastId) {
    cache.set(LAST_SELECTED_KEY, lastId);
  }
  cache.set(CURRENT_SELECTED_KEY, tab.tabId);
});
