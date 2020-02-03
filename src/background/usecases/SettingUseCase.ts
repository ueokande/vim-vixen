import { injectable } from 'tsyringe';
import LocalSettingRepository from '../repositories/LocalSettingRepository';
import CachedSettingRepository from '../repositories/CachedSettingRepository';
import { DefaultSettingData } from '../../shared/SettingData';
import Settings from '../../shared/settings/Settings';
import NotifyPresenter from '../presenters/NotifyPresenter';

@injectable()
export default class SettingUseCase {

  constructor(
    private localSettingRepository: LocalSettingRepository,
    private cachedSettingRepository: CachedSettingRepository,
    private notifyPresenter: NotifyPresenter,
  ) {
  }

  getCached(): Promise<Settings> {
    return this.cachedSettingRepository.get();
  }

  async reload(): Promise<Settings> {
    let data;
    try {
      data = await this.localSettingRepository.load();
    } catch (e) {
      this.showUnableToLoad(e);
    }
    if (!data) {
      data = DefaultSettingData;
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

  private showUnableToLoad(e: Error) {
    console.error('unable to load settings', e);
    this.notifyPresenter.notifyInvalidSettings(() => {
      browser.runtime.openOptionsPage();
    });
  }
}
