import { injectable, inject } from 'tsyringe';
import FindPresenter from '../presenters/FindPresenter';
import FindRepository from '../repositories/FindRepository';
import FindClient from '../client/FindClient';
import ConsoleClient from '../client/ConsoleClient';

@injectable()
export default class FindUseCase {
  constructor(
    @inject('FindPresenter') private presenter: FindPresenter,
    @inject('FindRepository') private repository: FindRepository,
    @inject('FindClient') private client: FindClient,
    @inject('ConsoleClient') private consoleClient: ConsoleClient,
  ) {
  }

  async startFind(keyword?: string): Promise<void> {
    this.presenter.clearSelection();
    if (keyword) {
      this.saveKeyword(keyword);
    } else {
      const lastKeyword = await this.getKeyword();
      if (!lastKeyword) {
        return this.showNoLastKeywordError();
      }
      this.saveKeyword(lastKeyword);
    }
    return this.findNext();
  }

  findNext(): Promise<void> {
    return this.findNextPrev(false);
  }

  findPrev(): Promise<void> {
    return this.findNextPrev(true);
  }

  private async findNextPrev(
    backwards: boolean,
  ): Promise<void> {
    const keyword = await this.getKeyword();
    if (!keyword) {
      return this.showNoLastKeywordError();
    }
    const found = this.presenter.find(keyword, backwards);
    if (found) {
      this.consoleClient.info('Pattern found: ' + keyword);
    } else {
      this.consoleClient.error('Pattern not found: ' + keyword);
    }
  }

  private async getKeyword(): Promise<string | null> {
    let keyword = this.repository.getLastKeyword();
    if (!keyword) {
      keyword = await this.client.getGlobalLastKeyword();
    }
    return keyword;
  }

  private async saveKeyword(keyword: string): Promise<void> {
    this.repository.setLastKeyword(keyword);
    await this.client.setGlobalLastKeyword(keyword);
  }

  private async showNoLastKeywordError(): Promise<void> {
    await this.consoleClient.error('No previous search keywords');
  }
}
