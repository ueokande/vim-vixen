import * as urls from '../../shared/urls';
import ClipboardRepository, { ClipboardRepositoryImpl }
  from '../repositories/ClipboardRepository';
import SettingRepository, { SettingRepositoryImpl }
  from '../repositories/SettingRepository';
import TabsClient, { TabsClientImpl }
  from '../client/TabsClient';
import ConsoleClient, { ConsoleClientImpl } from '../client/ConsoleClient';

export default class ClipboardUseCase {
  private repository: ClipboardRepository;

  private settingRepository: SettingRepository;

  private client: TabsClient;

  private consoleClient: ConsoleClient;

  constructor({
    repository = new ClipboardRepositoryImpl(),
    settingRepository = new SettingRepositoryImpl(),
    client = new TabsClientImpl(),
    consoleClient = new ConsoleClientImpl(),
  } = {}) {
    this.repository = repository;
    this.settingRepository = settingRepository;
    this.client = client;
    this.consoleClient = consoleClient;
  }

  async yankCurrentURL(): Promise<string> {
    let url = window.location.href;
    this.repository.write(url);
    await this.consoleClient.info('Yanked ' + url);
    return Promise.resolve(url);
  }

  async openOrSearch(newTab: boolean): Promise<void> {
    let search = this.settingRepository.get().search;
    let text = this.repository.read();
    let url = urls.searchUrl(text, search);
    await this.client.openUrl(url, newTab);
  }
}
