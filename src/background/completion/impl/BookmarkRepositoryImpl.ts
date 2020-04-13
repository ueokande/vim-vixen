import BookmarkRepository, {BookmarkItem} from "../BookmarkRepository";
import {HistoryItem} from "../HistoryRepository";
import PrefetchAndCache from "./PrefetchAndCache";

const COMPLETION_ITEM_LIMIT = 10;

export default class CachedBookmarkRepository implements BookmarkRepository {
  private bookmarkCache: PrefetchAndCache<BookmarkItem>;

  constructor() {
    this.bookmarkCache = new PrefetchAndCache(this.getter, this.filter, 10,);
  }

  queryBookmarks(query: string): Promise<BookmarkItem[]> {
    return this.bookmarkCache.get(query);
  }

  private async getter(query: string): Promise<BookmarkItem[]> {
    const items = await browser.bookmarks.search({query});
    return items
      .filter(item => item.title && item.title.length > 0)
      .filter(item => item.type === 'bookmark' && item.url)
      .filter((item) => {
        let url = undefined;
        try {
          url = new URL(item.url!!);
        } catch (e) {
          return false;
        }
        return url.protocol !== 'place:';
      })
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map(item => ({
        title: item.title!!,
        url: item.url!!,
      }));
  }

  private filter(items: HistoryItem[], query: string) {
    return items.filter(item => {
      return query.split(' ').every(keyword => {
        return item.title.toLowerCase().includes(keyword.toLowerCase()) || item.url!!.includes(keyword)
      });
    })
  };
}
