import { inject, injectable } from "tsyringe";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";

@injectable()
export default class ReadyFrameUseCase {
  constructor(
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  async addReadyFrame(tabId: number, frameId: number): Promise<void> {
    return this.frameRepository.addFrameId(tabId, frameId);
  }

  async clearReadyFrame(tabId: number): Promise<void> {
    return this.frameRepository.clearFrameIds(tabId);
  }
}
