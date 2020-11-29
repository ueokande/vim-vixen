import { inject, injectable } from "tsyringe";
import OperatorFactoryChain from "../OperatorFactoryChain";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import * as operations from "../../../shared/operations";
import Operator from "../Operator";
import EnableAddonOperator from "./EnableAddonOperator";
import DisableAddonOperator from "./DisableAddonOperator";
import ToggleAddonOperator from "./ToggleAddonOperator";

@injectable()
export default class AddonOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("AddonIndicatorClient")
    private readonly addonIndicatorClient: AddonIndicatorClient,
    @inject("AddonEnabledRepository")
    private readonly addonEnabledRepository: AddonEnabledRepository
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.ADDON_ENABLE:
        return new EnableAddonOperator(
          this.addonIndicatorClient,
          this.addonEnabledRepository
        );
      case operations.ADDON_DISABLE:
        return new DisableAddonOperator(
          this.addonIndicatorClient,
          this.addonEnabledRepository
        );
      case operations.ADDON_TOGGLE_ENABLED:
        return new ToggleAddonOperator(
          this.addonIndicatorClient,
          this.addonEnabledRepository
        );
    }
    return null;
  }
}
