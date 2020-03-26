import { injectable } from "tsyringe";
import * as filters from "./filters";
import HistoryRepository, {HistoryItem} from "../HistoryRepository";

const COMPLETION_ITEM_LIMIT = 10;

@injectable()
export default class HistoryRepositoryImpl implements HistoryRepository {
  async queryHistories(keywords: string): Promise<HistoryItem[]> {
    const items = await browser.history.search({
      text: keywords,
      startTime: 0,
    });

    return [items]
      .map(filters.filterBlankTitle)
      .map(filters.filterHttp)
      .map(filters.filterByTailingSlash)
      .map(pages => filters.filterByPathname(pages, COMPLETION_ITEM_LIMIT))
      .map(pages => filters.filterByOrigin(pages, COMPLETION_ITEM_LIMIT))[0]
      .sort((x, y) => Number(y.visitCount) - Number(x.visitCount))
      .slice(0, COMPLETION_ITEM_LIMIT)
      .map(item => ({
        title: item.title!!,
        url: item.url!!,
      }))
  }
}
