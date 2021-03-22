import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

export default class DisableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository,
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  async run(): Promise<void> {
    this.repository.set(false);
    this.consoleFramePresenter.detach();
    await this.indicator.setEnabled(false);
  }
}
