import { injectable } from 'tsyringe';
import TabPresenter from '../presenters/TabPresenter';
import MarkRepository from '../repositories/MarkRepository';
import ConsoleClient from '../infrastructures/ConsoleClient';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

@injectable()
export default class MarkUseCase {
  constructor(
    private tabPresenter: TabPresenter,
    private markRepository: MarkRepository,
    private consoleClient: ConsoleClient,
    private contentMessageClient: ContentMessageClient,
  ) {
  }

  async setGlobal(key: string, x: number, y: number): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const mark = { tabId: tab.id as number, url: tab.url as string, x, y };
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key: string): Promise<any> {
    const current = await this.tabPresenter.getCurrent();

    const mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consoleClient.showError(
        current.id as number, 'Mark is not set');
    }
    try {
      await this.contentMessageClient.scrollTo(mark.tabId, mark.x, mark.y);
      return this.tabPresenter.select(mark.tabId);
    } catch (e) {
      const tab = await this.tabPresenter.create(mark.url);
      return this.markRepository.setMark(key, {
        tabId: tab.id as number, url: mark.url, x: mark.x, y: mark.y,
      });
    }
  }
}
