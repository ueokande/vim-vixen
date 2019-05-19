import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';
import SettingUseCase from '../usecases/SettingUseCase';
import * as blacklists from '../../shared/blacklists';

import * as messages from '../../shared/messages';

export default class SettingController {
  private addonEnabledUseCase: AddonEnabledUseCase;

  private settingUseCase: SettingUseCase;

  constructor({
    addonEnabledUseCase = new AddonEnabledUseCase(),
    settingUseCase = new SettingUseCase(),
  } = {}) {
    this.addonEnabledUseCase = addonEnabledUseCase;
    this.settingUseCase = settingUseCase;
  }

  async initSettings(): Promise<void> {
    try {
      let current = await this.settingUseCase.reload();
      let disabled = blacklists.includes(
        current.blacklist, window.location.href,
      );
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
