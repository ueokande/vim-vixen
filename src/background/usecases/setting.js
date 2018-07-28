import Setting from '../domains/setting';
import PersistentSettingRepository from '../repositories/persistent-setting';
import SettingRepository from '../repositories/setting';

export default class SettingInteractor {
  constructor() {
    this.persistentSettingRepository = new PersistentSettingRepository();
    this.settingRepository = new SettingRepository();
  }

  save(settings) {
    this.persistentSettingRepository.save(settings);
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
