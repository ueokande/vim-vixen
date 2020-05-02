import { injectable } from "tsyringe";
import SettingUseCase from "../usecases/SettingUseCase";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import Settings from "../../shared/settings/Settings";

@injectable()
export default class SettingController {
  constructor(
    private settingUseCase: SettingUseCase,
    private contentMessageClient: ContentMessageClient
  ) {}

  getSetting(): Promise<Settings> {
    return this.settingUseCase.getCached();
  }

  async reload(): Promise<any> {
    await this.settingUseCase.reload();
    this.contentMessageClient.broadcastSettingsChanged();
  }
}
