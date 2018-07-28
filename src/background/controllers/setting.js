import SettingInteractor from '../usecases/setting';
import ContentMessageClient from '../infrastructures/content-message-client';

export default class SettingController {
  constructor() {
    this.settingInteractor = new SettingInteractor();
    this.contentMessageClient = new ContentMessageClient();
  }

  getSetting() {
    return this.settingInteractor.get();
  }

  async reload() {
    await this.settingInteractor.reload();
    this.contentMessageClient.broadcastSettingsChanged();
  }
}
