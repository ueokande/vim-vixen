import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";

export default class ToggleAddonOperator implements Operator {
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
