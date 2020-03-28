import {
  ConsoleGetCompletionTypesResponse,
  ConsoleRequestBookmarksResponse,
  ConsoleRequestHistoryResponse,
  ConsoleRequestSearchEnginesResponse,
  ConsoleRequesttabsResponse
} from "../../shared/messages";
import { injectable } from "tsyringe";
import OpenCompletionUseCase from "../completion/OpenCompletionUseCase";
import TabCompletionUseCase from "../completion/TabCompletionUseCase";

@injectable()
export default class CompletionController {
  constructor(
    private completionUseCase: OpenCompletionUseCase,
    private tabCompletionUseCase: TabCompletionUseCase,
  ) {
  }

  async getCompletionTypes(): Promise<ConsoleGetCompletionTypesResponse> {
    return this.completionUseCase.getCompletionTypes();
  }

  async requestSearchEngines(query: string): Promise<ConsoleRequestSearchEnginesResponse> {
    const items = await this.completionUseCase.requestSearchEngines(query);
    return items.map(name => ({ title: name }));
  }

  async requestBookmarks(query: string): Promise<ConsoleRequestBookmarksResponse> {
    return this.completionUseCase.requestBookmarks(query);
  }

  async requestHistory(query: string): Promise<ConsoleRequestHistoryResponse> {
    return this.completionUseCase.requestHistory(query);
  }

  async queryTabs(query: string, excludePinned: boolean): Promise<ConsoleRequesttabsResponse> {
    return this.tabCompletionUseCase.queryTabs(query, excludePinned);
  }
}