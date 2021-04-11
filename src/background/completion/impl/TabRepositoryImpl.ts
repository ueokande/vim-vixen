import TabRepository, { Tab } from "../TabRepository";

export default class TabRepositoryImpl implements TabRepository {
  async queryTabs(query: string, excludePinned: boolean, onlyCurrentWin: boolean): Promise<Tab[]> {
    const tabs = [
      ...await browser.tabs.query({ currentWindow: true }),
      ...(onlyCurrentWin ? [] : await browser.tabs.query({ currentWindow: false }))
    ]
    return tabs
      .filter((t) => {
        return (
          (t.url && t.url.toLowerCase().includes(query.toLowerCase())) ||
          (t.title && t.title.toLowerCase().includes(query.toLowerCase()))
        );
      })
      .filter((t) => {
        return !(excludePinned && t.pinned);
      })
      .filter((item) => item.id && item.title && item.url)
      .map(TabRepositoryImpl.toEntity);
  }

  async getAllTabs(excludePinned: boolean, onlyCurrentWin: boolean): Promise<Tab[]> {
    if (excludePinned) {
      return (
        [
            ...await browser.tabs.query({ currentWindow: true, pinned: true }),
            ...(onlyCurrentWin ? [] : await browser.tabs.query({ currentWindow: false, pinned: true }))
        ]
      ).map(TabRepositoryImpl.toEntity);
    }
    return [
      ...await browser.tabs.query({ currentWindow: true }),
      ...(onlyCurrentWin ? [] : await browser.tabs.query({ currentWindow: false }))
    ].map(
      TabRepositoryImpl.toEntity
    );
  }

  private static toEntity(tab: browser.tabs.Tab): Tab {
    return {
      id: tab.id!,
      url: tab.url!,
      active: tab.active,
      title: tab.title!,
      faviconUrl: tab.favIconUrl,
      index: tab.index,
      windowId: tab.windowId,
    };
  }
}
