import TabPresenter from "../../../src/background/presenters/TabPresenter";

export default class MockTabPresenter implements TabPresenter {
  private readonly tabs: browser.tabs.Tab[] = [];
  private readonly zooms: number[] = [];
  private nextid = 0;

  private readonly lastSelectedId: number | undefined;

  private static defaultTabOptions = {
    hidden: false,
    highlighted: false,
    incognito: false,
    isArticle: false,
    isInReaderMode: false,
    lastAccessed: 0,
    pinned: false,
    selected: false,
    windowId: 0,
  };

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
  ): Promise<browser.tabs.Tab> {
    const tab = {
      ...MockTabPresenter.defaultTabOptions,
      ...opts,
      id: this.nextid++,
      active: false,
      title: "welcome, world",
      url,
      index: this.tabs.length,
    };
    if (opts?.active || this.tabs.length === 0) {
      this.tabs.forEach((t) => (t.active = false));
      tab.active = true;
    }
    this.tabs.push(tab);
    this.zooms.push(1);
    return Promise.resolve(tab);
  }

  duplicate(id: number): Promise<browser.tabs.Tab> {
    const src = this.tabs.find((t) => t.id === id);
    if (!src) {
      throw new Error(`tab ${id} not found`);
    }
    this.tabs.forEach((t) => (t.active = false));
    const tab = { ...src, id: this.nextid++, active: true };
    this.tabs.push(tab);
    this.zooms.push(1);

    return Promise.resolve(tab);
  }

  getAll(): Promise<browser.tabs.Tab[]> {
    return Promise.resolve([...this.tabs]);
  }

  getByKeyword(
    keyword: string,
    excludePinned: boolean
  ): Promise<browser.tabs.Tab[]> {
    const tabs = this.tabs

      .filter((t) => {
        return (
          (t.url && t.url.toLowerCase().includes(keyword.toLowerCase())) ||
          (t.title && t.title.toLowerCase().includes(keyword.toLowerCase()))
        );
      })
      .filter((t) => {
        return !(excludePinned && t.pinned);
      });
    return Promise.resolve(tabs);
  }

  getCurrent(): Promise<browser.tabs.Tab> {
    const tab = this.tabs.find((t) => t.active);
    if (!tab) {
      throw new Error("active tab not found");
    }
    return Promise.resolve(tab);
  }

  getLastSelectedId(): Promise<number | undefined> {
    return Promise.resolve(this.lastSelectedId);
  }

  getZoom(tabId: number): Promise<number> {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) {
      throw new Error(`tab ${tabId} not found`);
    }
    return Promise.resolve(this.zooms[index]);
  }

  onSelected(
    _listener: (arg: { tabId: number; windowId: number }) => void
  ): void {
    throw new Error("not implemented");
  }

  open(url: string, tabId?: number): Promise<browser.tabs.Tab> {
    let tab = this.tabs.find((t) => t.active);
    if (!tab) {
      throw new Error(`active tab not found`);
    }
    if (tabId !== undefined) {
      tab = this.tabs.find((t) => t.id === tabId);
    }
    if (!tab) {
      throw new Error(`tab ${tabId} not found`);
    }
    tab.url = url;
    return Promise.resolve(tab);
  }

  reload(_tabId: number, _cache: boolean): Promise<void> {
    throw new Error("not implemented");
  }

  remove(ids: number[]): Promise<void> {
    for (const id of ids) {
      const index = this.tabs.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error(`tab ${id} not found`);
      }
      const tab = this.tabs[index];
      this.tabs.splice(index, 1);
      this.zooms.splice(index, 1);
      if (tab.active) {
        this.tabs[Math.min(index, this.tabs.length - 1)].active = true;
      }
    }

    return Promise.resolve(undefined);
  }

  reopen(): Promise<void> {
    throw new Error("not implemented");
  }

  select(tabId: number): Promise<void> {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (!tab) {
      throw new Error(`tab ${tabId} not found`);
    }
    this.tabs.forEach((t) => (t.active = false));
    tab.active = true;
    return Promise.resolve(undefined);
  }

  setPinned(tabId: number, pinned: boolean): Promise<void> {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (!tab) {
      throw new Error(`tab ${tabId} not found`);
    }
    tab.pinned = pinned;
    return Promise.resolve();
  }

  setZoom(tabId: number, factor: number): Promise<void> {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) {
      throw new Error(`tab ${tabId} not found`);
    }
    this.zooms[index] = factor;
    return Promise.resolve();
  }

  toggleReaderMode(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
