import TabPresenter from '../presenters/TabPresenter';
import MarkRepository from '../repositories/MarkRepository';
import ConsoleClient from '../infrastructures/ConsoleClient';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

export default class MarkUseCase {
  private tabPresenter: TabPresenter;

  private markRepository: MarkRepository;

  private consoleClient: ConsoleClient;

  private contentMessageClient: ContentMessageClient;

  constructor() {
    this.tabPresenter = new TabPresenter();
    this.markRepository = new MarkRepository();
    this.consoleClient = new ConsoleClient();
    this.contentMessageClient = new ContentMessageClient();
  }

  async setGlobal(key: string, x: number, y: number): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    let mark = { tabId: tab.id as number, url: tab.url as string, x, y };
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key: string): Promise<any> {
    let current = await this.tabPresenter.getCurrent();

    let mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consoleClient.showError(
        current.id as number, 'Mark is not set');
    }
    try {
      await this.contentMessageClient.scrollTo(mark.tabId, mark.x, mark.y);
      return this.tabPresenter.select(mark.tabId);
    } catch (e) {
      let tab = await this.tabPresenter.create(mark.url);
      return this.markRepository.setMark(key, {
        tabId: tab.id as number, url: mark.url, x: mark.x, y: mark.y,
      });
    }
  }
}
