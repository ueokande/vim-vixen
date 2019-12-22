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
      const current = await this.settingUseCase.reload();
      const url = new URL(window.location.href);
      const disabled = current.blacklist.includesEntireBlacklist(url);
      if (disabled) {
        await this.addonEnabledUseCase.disable();
      } else {
        await this.addonEnabledUseCase.enable();
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
