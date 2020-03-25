import { inject, injectable } from "tsyringe";
import HistoryRepository from "./HistoryRepository";
import BookmarkRepository from "./BookmarkRepository";
import CachedSettingRepository from "../repositories/CachedSettingRepository";

export type BookmarkItem = {
  title: string
  url: string
}

export type HistoryItem = {
  title: string
  url: string
}

@injectable()
export default class CompletionUseCase {
  constructor(
    private bookmarkRepository: BookmarkRepository,
    private historyRepository: HistoryRepository,
    @inject("CachedSettingRepository")
    private cachedSettingRepository: CachedSettingRepository,
  ) {
  }

  async requestSearchEngines(query: string): Promise<string[]> {
    const settings = await this.cachedSettingRepository.get();
    return Object.keys(settings.search.engines)
      .filter(key => key.startsWith(query))
  }

  requestBookmarks(query: any): Promise<BookmarkItem[]> {
    return this.bookmarkRepository.queryBookmarks(query);
  }

  async requestHistory(query: string): Promise<HistoryItem[]> {
    return this.historyRepository.queryHistories(query);
  }
}