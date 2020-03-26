import { inject, injectable } from "tsyringe";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import CompletionType from "../../shared/CompletionType";
import BookmarkRepository from "./BookmarkRepository";
import HistoryRepository from "./HistoryRepository";

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
    @inject('BookmarkRepository') private bookmarkRepository: BookmarkRepository,
    @inject('HistoryRepository') private historyRepository: HistoryRepository,
    @inject("CachedSettingRepository") private cachedSettingRepository: CachedSettingRepository,
  ) {
  }

  async getCompletionTypes(): Promise<CompletionType[]> {
    const settings = await this.cachedSettingRepository.get();
    const types: CompletionType[] = [];
    for (const c of settings.properties.complete) {
      switch (c) {
      case 's':
        types.push(CompletionType.SearchEngines);
        break;
      case 'h':
        types.push(CompletionType.History);
        break;
      case 'b':
        types.push(CompletionType.Bookmarks);
        break;
      }
      // ignore invalid characters in the complete property
    }
    return types;
  }

  async requestSearchEngines(query: string): Promise<string[]> {
    const settings = await this.cachedSettingRepository.get();
    return Object.keys(settings.search.engines)
      .filter(key => key.startsWith(query))
  }

  requestBookmarks(query: string): Promise<BookmarkItem[]> {
    return this.bookmarkRepository.queryBookmarks(query);
  }

  requestHistory(query: string): Promise<HistoryItem[]> {
    return this.historyRepository.queryHistories(query);
  }
}