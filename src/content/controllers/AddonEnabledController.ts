import { injectable } from 'tsyringe';
import * as messages from '../../shared/messages';
import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';

@injectable()
export default class AddonEnabledController {
  constructor(
    private addonEnabledUseCase: AddonEnabledUseCase,
  ) {
  }

  getAddonEnabled(
    _message: messages.AddonEnabledQueryMessage,
  ): Promise<boolean> {
    let enabled = this.addonEnabledUseCase.getEnabled();
    return Promise.resolve(enabled);
  }
}
