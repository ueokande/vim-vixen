import * as filters from "./filters";
import HistoryRepository, { HistoryItem } from "../HistoryRepository";
import PrefetchAndCache from "./PrefetchAndCache";

const COMPLETION_ITEM_LIMIT = 10;

export default class CachedHistoryRepository implements HistoryRepository {
  private historyCache: PrefetchAndCache<browser.history.HistoryItem>;

  constructor() {
    this.historyCache = new PrefetchAndCache(this.getter, this.filter, 10);
  }

  async queryHistories(keywords: string): Promise<HistoryItem[]> {
    const items = await this.historyCache.get(keywords);

    const filterOrKeep = <T>(
      source: T[],
      filter: (items: T[]) => T[],
      min: number
    ): T[] => {
      const filtered = filter(source);
      if (filtered.length < min) {
        return source;
      }
      return filtered;
    };

    return [items]
      .map((items) =>
        filterOrKeep(items, filters.filterByPathname, COMPLETION_ITEM_LIMIT)
      )
      .map((items) =>
        filterOrKeep(items, filters.filterByOrigin, COMPLETION_ITEM_LIMIT)
      )[0]
      .sort((x, y) => Number(y.visitCount) - Number(x.visitCount))
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map((item) => ({
        title: item.title!!,
        url: item.url!!,
      }));
  }

  private async getter(
    keywords: string
  ): Promise<browser.history.HistoryItem[]> {
    const items = await browser.history.search({
      text: keywords,
      startTime: 0,
    });

    return [items]
      .map(filters.filterBlankTitle)
      .map(filters.filterHttp)
      .map(filters.filterByTailingSlash)[0];
  }

  private filter(items: browser.history.HistoryItem[], query: string) {
    return items.filter((item) => {
      return query.split(" ").every((keyword) => {
        return (
          item.title!!.toLowerCase().includes(keyword.toLowerCase()) ||
          item.url!!.includes(keyword)
        );
      });
    });
  }
}
