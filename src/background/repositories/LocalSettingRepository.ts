import { injectable } from 'tsyringe';
import SettingData from '../../shared/SettingData';

@injectable()
export default class LocalSettingRepository {
  async load(): Promise<SettingData | null> {
    const { settings } = await browser.storage.local.get('settings');
    if (!settings) {
      return null;
    }
    return SettingData.fromJSON(settings as any);
  }

  onChange(callback: () => void) {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') {
        return;
      }
      if (changes.settings) {
        callback();
      }
    });
  }
}

