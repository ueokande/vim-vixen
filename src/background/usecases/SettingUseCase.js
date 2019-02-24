import Setting from '../domains/Setting';
// eslint-disable-next-line max-len
import PersistentSettingRepository from '../repositories/PersistentSettingRepository';
import SettingRepository from '../repositories/SettingRepository';

export default class SettingUseCase {
  constructor() {
    this.persistentSettingRepository = new PersistentSettingRepository();
    this.settingRepository = new SettingRepository();
  }

  get() {
    return this.settingRepository.get();
  }

  async reload() {
    let settings = await this.persistentSettingRepository.load();
    if (!settings) {
      settings = Setting.defaultSettings();
    }

    let value = settings.value();

    this.settingRepository.update(value);

    return value;
  }
}
