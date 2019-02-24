import FindRepository from '../repositories/FindRepository';
import TabPresenter from '../presenters/TabPresenter';
import ConsoleClient from '../infrastructures/ConsoleClient';

export default class FindUseCase {
  constructor() {
    this.tabPresenter = new TabPresenter();
    this.findRepository = new FindRepository();
    this.consoleClient = new ConsoleClient();
  }

  getKeyword() {
    return this.findRepository.getKeyword();
  }

  setKeyword(keyword) {
    return this.findRepository.setKeyword(keyword);
  }

  async findStart() {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.showFind(tab.id);
  }
}
