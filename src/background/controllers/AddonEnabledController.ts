import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';

export default class AddonEnabledController {
  private addonEnabledUseCase: AddonEnabledUseCase;

  constructor() {
    this.addonEnabledUseCase = new AddonEnabledUseCase();
  }

  indicate(enabled: boolean): Promise<any> {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
