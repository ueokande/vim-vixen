import FindPresenter, { FindPresenterImpl } from '../presenters/FindPresenter';
import FindRepository, { FindRepositoryImpl }
  from '../repositories/FindRepository';
import FindClient, { FindClientImpl } from '../client/FindClient';
import ConsoleClient, { ConsoleClientImpl } from '../client/ConsoleClient';

export default class FindUseCase {
  private presenter: FindPresenter;

  private repository: FindRepository;

  private client: FindClient;

  private consoleClient: ConsoleClient;

  constructor({
    presenter = new FindPresenterImpl() as FindPresenter,
    repository = new FindRepositoryImpl(),
    client = new FindClientImpl(),
    consoleClient = new ConsoleClientImpl(),
  } = {}) {
    this.presenter = presenter;
    this.repository = repository;
    this.client = client;
    this.consoleClient = consoleClient;
  }

  async startFind(keyword?: string): Promise<void> {
    this.presenter.clearSelection();
    if (keyword) {
      this.saveKeyword(keyword);
    } else {
      let lastKeyword = await this.getKeyword();
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
    let keyword = await this.getKeyword();
    if (!keyword) {
      return this.showNoLastKeywordError();
    }
    let found = this.presenter.find(keyword, backwards);
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
