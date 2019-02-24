import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';

export default class AddonEnabledController {
  constructor() {
    this.addonEnabledUseCase = new AddonEnabledUseCase();
  }

  indicate(enabled) {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
