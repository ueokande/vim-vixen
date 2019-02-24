import SettingUseCase from '../usecases/SettingUseCase';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

export default class SettingController {
  constructor() {
    this.settingUseCase = new SettingUseCase();
    this.contentMessageClient = new ContentMessageClient();
  }

  getSetting() {
    return this.settingUseCase.get();
  }

  async reload() {
    await this.settingUseCase.reload();
    this.contentMessageClient.broadcastSettingsChanged();
  }
}
