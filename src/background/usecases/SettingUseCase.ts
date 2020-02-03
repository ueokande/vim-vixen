import { injectable } from 'tsyringe';
import LocalSettingRepository from '../repositories/LocalSettingRepository';
import CachedSettingRepository from '../repositories/CachedSettingRepository';
import SettingData, { DefaultSettingData } from '../../shared/SettingData';
import Settings from '../../shared/settings/Settings';
import NotifyPresenter from '../presenters/NotifyPresenter';
import SyncSettingRepository from "../repositories/SyncSettingRepository";

@injectable()
export default class SettingUseCase {

  constructor(
    private localSettingRepository: LocalSettingRepository,
    private syncSettingRepository: SyncSettingRepository,
    private cachedSettingRepository: CachedSettingRepository,
    private notifyPresenter: NotifyPresenter,
  ) {
  }

  getCached(): Promise<Settings> {
    return this.cachedSettingRepository.get();
  }

  async reload(): Promise<Settings> {
    let data = DefaultSettingData;
    try {
      data = await this.loadSettings();
    } catch (e) {
      this.showUnableToLoad(e);
    }

    let value: Settings;
    try {
      value = data.toSettings();
    } catch (e) {
      this.showUnableToLoad(e);
      value = DefaultSettingData.toSettings();
    }
    this.cachedSettingRepository.update(value!!);
    return value;
  }

  private async loadSettings(): Promise<SettingData> {
    const sync = await this.syncSettingRepository.load();
    if (sync) {
        return sync;
    }
    const local = await this.localSettingRepository.load();
    if (local) {
      return local;
    }
    return DefaultSettingData;
  }

  private showUnableToLoad(e: Error) {
    console.error('unable to load settings', e);
    this.notifyPresenter.notifyInvalidSettings(() => {
      browser.runtime.openOptionsPage();
    });
  }
}
