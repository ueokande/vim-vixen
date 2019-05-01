import Setting from '../domains/Setting';

export default class SettingRepository {
  async load(): Promise<any> {
    let { settings } = await browser.storage.local.get('settings');
    if (!settings) {
      return null;
    }
    return Setting.deserialize(settings);
  }
}

