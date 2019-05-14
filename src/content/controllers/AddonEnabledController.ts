import * as messages from '../../shared/messages';
import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';

export default class AddonEnabledController {
  private addonEnabledUseCase: AddonEnabledUseCase;

  constructor({
    addonEnabledUseCase = new AddonEnabledUseCase(),
  } = {}) {
    this.addonEnabledUseCase = addonEnabledUseCase;
  }

  getAddonEnabled(
    _message: messages.AddonEnabledQueryMessage,
  ): Promise<boolean> {
    let enabled = this.addonEnabledUseCase.getEnabled();
    return Promise.resolve(enabled);
  }
}
