import AddonEnabledInteractor from '../usecases/addon-enabled';

export default class AddonEnabledController {
  constructor() {
    this.addonEnabledInteractor = new AddonEnabledInteractor();
  }

  indicate(enabled) {
    this.addonEnabledInteractor.indicate(enabled);
  }
}
