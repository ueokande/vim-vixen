import { injectable } from 'tsyringe';
import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';
import SettingUseCase from '../usecases/SettingUseCase';
import * as messages from '../../shared/messages';

@injectable()
export default class SettingController {

  constructor(
    private addonEnabledUseCase: AddonEnabledUseCase,
    private settingUseCase: SettingUseCase,
  ) {
  }

  async initSettings(): Promise<void> {
    try {
      let current = await this.settingUseCase.reload();
      let url = new URL(window.location.href);
      let disabled = current.blacklist.includesEntireBlacklist(url);
      if (disabled) {
        this.addonEnabledUseCase.disable();
      } else {
        this.addonEnabledUseCase.enable();
      }
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.initSettings(), 500);
    }
  }

  async reloadSettings(_message: messages.Message): Promise<void> {
    await this.settingUseCase.reload();
  }
}
