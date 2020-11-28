import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import * as operations from "../../../shared/operations";

export class EnableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository
  ) {}

  async run(): Promise<void> {
    this.repository.set(true);
    await this.indicator.setEnabled(true);
  }
}

export class DisableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository
  ) {}

  async run(): Promise<void> {
    this.repository.set(false);
    await this.indicator.setEnabled(false);
  }
}

export class ToggleAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository
  ) {}

  async run(): Promise<void> {
    const current = this.repository.get();
    this.repository.set(!current);
    await this.indicator.setEnabled(!current);
  }
}

@injectable()
export class AddonOperatorFactoryChain implements OperatorFactoryChain {
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
