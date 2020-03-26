import {
  ConsoleGetCompletionTypesResponse,
  ConsoleRequestBookmarksResponse, ConsoleRequestHistoryResponse, ConsoleRequestSearchEnginesResponse
} from "../../shared/messages";
import { injectable } from "tsyringe";
import CompletionUseCase from "../completion/CompletionUseCase";

@injectable()
export default class CompletionController {
  constructor(
    private completionUseCase: CompletionUseCase,
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
}