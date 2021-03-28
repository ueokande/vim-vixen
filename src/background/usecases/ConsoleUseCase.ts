import { inject, injectable } from "tsyringe";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";
import TabPresenter from "../presenters/TabPresenter";

@injectable()
export default class ConsoleUseCase {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("ConsoleFrameClient")
    private readonly consoleFrameClient: ConsoleFrameClient
  ) {}

  async resize(width: number, height: number): Promise<void> {
    const tabId = (await this.tabPresenter.getCurrent()).id;
    if (typeof tabId === "undefined") {
      return;
    }
    return this.consoleFrameClient.resize(tabId, width, height);
  }
}
