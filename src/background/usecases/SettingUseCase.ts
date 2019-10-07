import { injectable } from 'tsyringe';
import PersistentSettingRepository
  from '../repositories/PersistentSettingRepository';
import SettingRepository from '../repositories/SettingRepository';
import { DefaultSettingData } from '../../shared/SettingData';
import Settings from '../../shared/settings/Settings';
import NotifyPresenter from '../presenters/NotifyPresenter';

@injectable()
export default class SettingUseCase {

  constructor(
    private persistentSettingRepository: PersistentSettingRepository,
    private settingRepository: SettingRepository,
    private notifyPresenter: NotifyPresenter,
  ) {
  }

  get(): Promise<Settings> {
    return this.settingRepository.get();
  }

  async reload(): Promise<Settings> {
    let data;
    try {
      data = await this.persistentSettingRepository.load();
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
    this.settingRepository.update(value!!);
    return value;
  }

  private showUnableToLoad(e: Error) {
    console.error('unable to load settings', e);
    this.notifyPresenter.notifyInvalidSettings(() => {
      browser.runtime.openOptionsPage();
    });
  }
}
