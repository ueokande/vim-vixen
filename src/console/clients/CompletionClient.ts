import * as messages from "../../shared/messages";
import {
  ConsoleGetCompletionTypesResponse, ConsoleGetPropertiesResponse,
  ConsoleRequestBookmarksResponse,
  ConsoleRequestHistoryResponse, ConsoleRequestSearchEnginesResponse, ConsoleRequesttabsResponse
} from "../../shared/messages";
import CompletionType from "../../shared/CompletionType";
import TabFlag from "../../shared/TabFlag";

export type SearchEngines = {
  title: string
}

export type BookmarkItem = {
  title: string
  url: string
}

export type HistoryItem = {
  title: string
  url: string
}

export type TabItem = {
  index: number
  flag: TabFlag
  title: string
  url: string
  faviconUrl?: string
}

export type Property = {
  name: string
  type: 'string' | 'boolean' | 'number';
}

export default class CompletionClient {
  async getCompletionTypes(): Promise<CompletionType[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_GET_COMPLETION_TYPES,
    }) as ConsoleGetCompletionTypesResponse;
    return resp;
  }

  async requestSearchEngines(query: string): Promise<SearchEngines[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_REQUEST_SEARCH_ENGINES_MESSAGE,
      query,
    }) as ConsoleRequestSearchEnginesResponse;
    return resp;
  }

  async requestBookmarks(query: string): Promise<BookmarkItem[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_REQUEST_BOOKMARKS,
      query,
    }) as ConsoleRequestBookmarksResponse;
    return resp;
  }

  async requestHistory(query: string): Promise<HistoryItem[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_REQUEST_HISTORY,
      query,
    }) as ConsoleRequestHistoryResponse;
    return resp;
  }

  async requestTabs(query: string, excludePinned: boolean): Promise<TabItem[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_REQUEST_TABS,
      query,
      excludePinned,
    }) as ConsoleRequesttabsResponse;
    return resp;
  }

  async getProperties(): Promise<Property[]> {
    const resp = await browser.runtime.sendMessage({
      type: messages.CONSOLE_GET_PROPERTIES,
    }) as ConsoleGetPropertiesResponse;
    return resp;
  }
}
