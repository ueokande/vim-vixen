import ScrollPresenter, { ScrollPresenterImpl }
  from '../presenters/ScrollPresenter';
import MarkClient, { MarkClientImpl } from '../client/MarkClient';
import MarkRepository, { MarkRepositoryImpl }
  from '../repositories/MarkRepository';
import SettingRepository, { SettingRepositoryImpl }
  from '../repositories/SettingRepository';
import ConsoleClient, { ConsoleClientImpl } from '../client/ConsoleClient';

export default class MarkUseCase {
  private scrollPresenter: ScrollPresenter;

  private client: MarkClient;

  private repository: MarkRepository;

  private settingRepository: SettingRepository;

  private consoleClient: ConsoleClient;

  constructor({
    scrollPresenter = new ScrollPresenterImpl(),
    client = new MarkClientImpl(),
    repository = new MarkRepositoryImpl(),
    settingRepository = new SettingRepositoryImpl(),
    consoleClient = new ConsoleClientImpl(),
  } = {}) {
    this.scrollPresenter = scrollPresenter;
    this.client = client;
    this.repository = repository;
    this.settingRepository = settingRepository;
    this.consoleClient = consoleClient;
  }

  async set(key: string): Promise<void> {
    let pos = this.scrollPresenter.getScroll();
    if (this.globalKey(key)) {
      this.client.setGloablMark(key, pos);
      await this.consoleClient.info(`Set global mark to '${key}'`);
    } else {
      this.repository.set(key, pos);
      await this.consoleClient.info(`Set local mark to '${key}'`);
    }
  }

  async jump(key: string): Promise<void> {
    if (this.globalKey(key)) {
      await this.client.jumpGlobalMark(key);
    } else {
      let pos = this.repository.get(key);
      if (!pos) {
        throw new Error('Mark is not set');
      }
      this.scroll(pos.x, pos.y);
    }
  }

  scroll(x: number, y: number): void {
    let smooth = this.settingRepository.get().properties.smoothscroll;
    this.scrollPresenter.scrollTo(x, y, smooth);
  }

  private globalKey(key: string) {
    return (/^[A-Z0-9]$/).test(key);
  }
}
