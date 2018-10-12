import GlobalMark from '../domains/global-mark';
import TabPresenter from '../presenters/tab';
import MarkRepository from '../repositories/mark';
import ConsolePresenter from '../presenters/console';

export default class MarkInteractor {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.markRepository = new MarkRepository();
    this.consolePresenter = new ConsolePresenter();
  }

  async setGlobal(key, x, y) {
    let tab = await this.tabPresenter.getCurrent();
    let mark = new GlobalMark(tab.id, x, y);
    return this.markRepository.setMark(key, mark);
  }

  async jumpGlobal(key) {
    let current = await this.tabPresenter.getCurrent();

    let mark = await this.markRepository.getMark(key);
    if (!mark) {
      return this.consolePresenter.showError(current.id, 'Mark is not set');
    }
    // TODO scroll pages and handle if tab is gone
    return this.tabPresenter.select(mark.tabId);
  }
}
