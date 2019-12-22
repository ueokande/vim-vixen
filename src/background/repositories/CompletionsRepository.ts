import { injectable } from 'tsyringe';

type Tab = browser.tabs.Tab;
type BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;

@injectable()
export default class CompletionsRepository {
  async queryBookmarks(keywords: string): Promise<BookmarkTreeNode[]> {
    const items = await browser.bookmarks.search({ query: keywords });
    return items.filter((item) => {
      if (!item.url) {
        return false;
      }
      let url = undefined;
      try {
        url = new URL(item.url);
      } catch (e) {
        return false;
      }
      return item.type === 'bookmark' && url.protocol !== 'place:';
    });
  }

  queryHistories(keywords: string): Promise<browser.history.HistoryItem[]> {
    return browser.history.search({
      text: keywords,
      startTime: 0,
    });
  }

  async queryTabs(keywords: string, excludePinned: boolean): Promise<Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return t.url && t.url.toLowerCase().includes(keywords.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keywords.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  }
}
