import { JSONTextSettings, SettingSource } from "../../src/shared/SettingData";
import Settings from "../../src/shared/settings/Settings";

export default class SettingRepository {
  constructor(private readonly browser: any) {}

  async saveJSON(settings: Settings): Promise<void> {
    await this.browser.storage.sync.set({
      settings: {
        source: SettingSource.JSON,
        json: JSONTextSettings.fromSettings(settings).toJSONText(),
      },
    });
  }
}
