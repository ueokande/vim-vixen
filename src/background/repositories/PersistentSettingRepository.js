import Setting from '../domains/Setting';

export default class SettingRepository {
  save(settings) {
    return browser.storage.local.set({ settings: settings.serialize() });
  }

  async load() {
    let { settings } = await browser.storage.local.get('settings');
    if (!settings) {
      return null;
    }
    return Setting.deserialize(settings);
  }
}

