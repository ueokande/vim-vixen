import { injectable } from 'tsyringe';
import FindRepository from '../repositories/FindRepository';
import TabPresenter from '../presenters/TabPresenter';
import ConsoleClient from '../infrastructures/ConsoleClient';

@injectable()
export default class FindUseCase {
  constructor(
    private tabPresenter: TabPresenter,
    private findRepository: FindRepository,
    private consoleClient: ConsoleClient,
  ) {
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
