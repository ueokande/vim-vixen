import { inject, injectable } from "tsyringe";
import FindRepositoryImpl from "../repositories/FindRepository";
import FindClient from "../clients/FindClient";

@injectable()
export default class StartFindUseCase {
  constructor(
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl
  ) {}

  async startFind(tabId: number, keyword?: string): Promise<void> {
    if (typeof keyword === "undefined") {
      keyword = (await this.findRepository.getLocalState(tabId))?.keyword;
    }
    if (typeof keyword === "undefined") {
      keyword = await this.findRepository.getGlobalKeyword();
    }
    if (typeof keyword === "undefined") {
      throw new Error("No previous search keywords");
    }

    const match = await this.findClient.startFind(keyword);
    if (match.count == 0) {
      throw new Error(`Pattern not found: ${keyword}`);
    }
    await this.findClient.highlightAll();
    await this.findClient.selectKeyword(tabId, keyword, match.rangeData[0]);

    await this.findRepository.setGlobalKeyword(keyword);
    await this.findRepository.setLocalState(tabId, {
      keyword,
      rangeData: match.rangeData,
      highlightPosition: 0,
    });
  }
}
