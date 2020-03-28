import TabRepository, { Tab } from "../TabRepository";

const COMPLETION_ITEM_LIMIT = 10;

export default class TabRepositoryImpl implements TabRepository {
  async queryTabs(query: string, excludePinned: boolean): Promise<Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    return tabs
      .filter((t) => {
        return t.url && t.url.toLowerCase().includes(query.toLowerCase()) ||
          t.title && t.title.toLowerCase().includes(query.toLowerCase());
      })
      .filter((t) => {
        return !(excludePinned && t.pinned);
      })
      .filter(item => item.id && item.title && item.url)
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map(item => ({
        id: item.id!!,
        url: item.url!!,
        active: item.active,
        title: item.title!!,
        faviconUrl: item.favIconUrl,
        index: item.index,
      }))
  }
}