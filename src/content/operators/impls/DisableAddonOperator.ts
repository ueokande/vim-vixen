import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";

export default class DisableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository
  ) {}

  async run(): Promise<void> {
    this.repository.set(false);
    await this.indicator.setEnabled(false);
  }
}
