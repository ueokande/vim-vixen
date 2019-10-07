import { injectable } from 'tsyringe';
import SettingData from '../../shared/SettingData';

@injectable()
export default class SettingRepository {
  async load(): Promise<SettingData | null> {
    let { settings } = await browser.storage.local.get('settings');
    if (!settings) {
      return null;
    }
    return SettingData.fromJSON(settings as any);
  }
}

