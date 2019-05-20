import { injectable, inject } from 'tsyringe';
import * as urls from '../../shared/urls';
import ClipboardRepository from '../repositories/ClipboardRepository';
import SettingRepository from '../repositories/SettingRepository';
import TabsClient from '../client/TabsClient';
import ConsoleClient from '../client/ConsoleClient';

@injectable()
export default class ClipboardUseCase {
  constructor(
    @inject('ClipboardRepository') private repository: ClipboardRepository,
    @inject('SettingRepository') private settingRepository: SettingRepository,
    @inject('TabsClient') private client: TabsClient,
    @inject('ConsoleClient') private consoleClient: ConsoleClient,
  ) {
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
