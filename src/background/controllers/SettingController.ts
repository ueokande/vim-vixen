import SettingUseCase from '../usecases/SettingUseCase';
import ContentMessageClient from '../infrastructures/ContentMessageClient';
import Settings from '../../shared/Settings';

export default class SettingController {
  private settingUseCase: SettingUseCase;

  private contentMessageClient: ContentMessageClient;

  constructor() {
    this.settingUseCase = new SettingUseCase();
    this.contentMessageClient = new ContentMessageClient();
  }

  getSetting(): Promise<Settings> {
    return this.settingUseCase.get();
  }

  async reload(): Promise<any> {
    await this.settingUseCase.reload();
    this.contentMessageClient.broadcastSettingsChanged();
  }
}
