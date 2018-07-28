import AddonEnabledInteractor from '../usecases/addon-enabled';

export default class AddonEnabledController {
  constructor() {
    this.addonEnabledInteractor = new AddonEnabledInteractor();
  }

  indicate(enabled) {
    return this.addonEnabledInteractor.indicate(enabled);
  }
}
