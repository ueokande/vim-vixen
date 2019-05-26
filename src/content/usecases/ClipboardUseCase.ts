import { injectable, inject } from 'tsyringe';
import * as urls from '../../shared/urls';
import ClipboardRepository from '../repositories/ClipboardRepository';
import SettingRepository from '../repositories/SettingRepository';
import ConsoleClient from '../client/ConsoleClient';
import OperationClient from '../client/OperationClient';

@injectable()
export default class ClipboardUseCase {
  constructor(
    @inject('ClipboardRepository') private repository: ClipboardRepository,
    @inject('SettingRepository') private settingRepository: SettingRepository,
    @inject('ConsoleClient') private consoleClient: ConsoleClient,
    @inject('OperationClient') private operationClinet: OperationClient,
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

    // TODO: Repeat pasting from clipboard instead of opening a certain url.
    // 'Repeat last' command is implemented in the background script and cannot
    // access to clipboard until Firefox 63.
    await this.operationClinet.internalOpenUrl(url, newTab);
  }
}
