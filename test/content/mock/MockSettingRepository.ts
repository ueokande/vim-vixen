import SettingRepository from "../../../src/content/repositories/SettingRepository";
import Settings, {
  DefaultSetting,
} from "../../../src/shared/settings/Settings";

export default class MockSettingRepository implements SettingRepository {
  private value: Settings;

  constructor(initValue: Settings = DefaultSetting) {
    this.value = initValue;
  }

  get(): Settings {
    return this.value;
  }

  set(setting: Settings): void {
    this.value = setting;
  }
}
