import FindRepository from '../repositories/FindRepository';
import TabPresenter from '../presenters/TabPresenter';
import ConsoleClient from '../infrastructures/ConsoleClient';

export default class FindUseCase {
  private tabPresenter: TabPresenter;

  private findRepository: FindRepository;

  private consoleClient: ConsoleClient;

  constructor() {
    this.tabPresenter = new TabPresenter();
    this.findRepository = new FindRepository();
    this.consoleClient = new ConsoleClient();
  }

  getKeyword(): Promise<string> {
    return this.findRepository.getKeyword();
  }

  setKeyword(keyword: string): Promise<any> {
    return this.findRepository.setKeyword(keyword);
  }

  async findStart(): Promise<any> {
    let tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.showFind(tab.id as number);
  }
}
