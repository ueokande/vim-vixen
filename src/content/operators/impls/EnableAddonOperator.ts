import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";

export default class EnableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository
  ) {}

  async run(): Promise<void> {
    this.repository.set(true);
    await this.indicator.setEnabled(true);
  }
}
