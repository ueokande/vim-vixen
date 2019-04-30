import GlobalMark from '../domains/GlobalMark';
import TabPresenter from '../presenters/TabPresenter';
import MarkRepository from '../repositories/MarkRepository';
import ConsoleClient from '../infrastructures/ConsoleClient';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

export default class MarkUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.markRepository = new MarkRepository();
    this.consoleClient = new ConsoleClient();
    this.contentMessageClient = new ContentMessageClient();
  }

  async setGlobal(key, x, y) {
    let tab = await this.tabPresenter.getCurrent();
    let mark = new GlobalMark(tab.id, tab.url, x, y);
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key) {
    let current = await this.tabPresenter.getCurrent();

    let mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consoleClient.showError(current.id, 'Mark is not set');
    }

    return this.contentMessageClient.scrollTo(
      mark.tabId, mark.x, mark.y
    ).then(() => {
      return this.tabPresenter.select(mark.tabId);
    }).catch(async() => {
      let tab = await this.tabPresenter.create(mark.url);
      let mark2 = new GlobalMark(tab.id, mark.url, mark.x, mark.y);
      return this.markRepository.setMark(key, mark2);
    });
  }
}
