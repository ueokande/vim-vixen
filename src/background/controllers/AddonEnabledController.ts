import { injectable } from "tsyringe";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";

@injectable()
export default class AddonEnabledController {
  constructor(private addonEnabledUseCase: AddonEnabledUseCase) {}

  indicate(enabled: boolean): Promise<any> {
    return this.addonEnabledUseCase.indicate(enabled);
  }
}
