import SettingData from '../../shared/SettingData';

export default class SettingRepository {
  async load(): Promise<SettingData | null> {
    let { settings } = await browser.storage.local.get('settings');
    if (!settings) {
      return null;
    }
    return SettingData.valueOf(settings);
  }
}

