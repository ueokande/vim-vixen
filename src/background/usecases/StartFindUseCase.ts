import { inject, injectable } from "tsyringe";
import ConsoleClient from "../infrastructures/ConsoleClient";
import FindRepositoryImpl from "../repositories/FindRepository";
import FindClient from "../clients/FindClient";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";

@injectable()
export default class StartFindUseCase {
  constructor(
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("FindRepository")
    private readonly findRepository: FindRepositoryImpl,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  async startFind(tabId: number, keyword?: string): Promise<void> {
    if (typeof keyword === "undefined") {
      keyword = (await this.findRepository.getLocalState(tabId))?.keyword;
    }
    if (typeof keyword === "undefined") {
      keyword = await this.findRepository.getGlobalKeyword();
    }
    if (typeof keyword === "undefined") {
      await this.consoleClient.showError(tabId, "No previous search keywords");
      return;
    }

    this.findRepository.setGlobalKeyword(keyword);

    const frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      // No frames are ready
      return;
    }
    for (const frameId of frameIds) {
      await this.findClient.clearSelection(tabId, frameId);
    }

    for (let framePos = 0; framePos < frameIds.length; ++framePos) {
      const found = await this.findClient.findNext(
        tabId,
        frameIds[framePos],
        keyword
      );
      if (found) {
        await this.findRepository.setLocalState(tabId, {
          frameIds,
          framePos,
          keyword,
        });
        await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
        return;
      }
    }
    this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
  }
}
