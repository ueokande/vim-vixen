import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";
import MarkRepository from "../repositories/MarkRepository";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import ConsoleClient from "../infrastructures/ConsoleClient";

@injectable()
export default class MarkUseCase {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    private readonly markRepository: MarkRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  async setGlobal(key: string, x: number, y: number): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const mark = { tabId: tab.id as number, url: tab.url as string, x, y };
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key: string): Promise<void> {
    const current = await this.tabPresenter.getCurrent();

    const mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consoleClient.showError(
        current.id as number,
        "Mark is not set"
      );
    }
    try {
      await this.contentMessageClient.scrollTo(mark.tabId, mark.x, mark.y);
      return this.tabPresenter.select(mark.tabId);
    } catch (e) {
      const tab = await this.tabPresenter.create(mark.url);
      return this.markRepository.setMark(key, {
        tabId: tab.id as number,
        url: mark.url,
        x: mark.x,
        y: mark.y,
      });
    }
  }
}
