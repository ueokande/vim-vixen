import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

export default class EnableAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository,
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  async run(): Promise<void> {
    this.repository.set(true);
    this.consoleFramePresenter.attach();
    await this.indicator.setEnabled(true);
  }
}
