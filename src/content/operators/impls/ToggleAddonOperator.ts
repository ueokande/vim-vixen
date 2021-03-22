import Operator from "../Operator";
import AddonIndicatorClient from "../../client/AddonIndicatorClient";
import AddonEnabledRepository from "../../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../../presenters/ConsoleFramePresenter";

export default class ToggleAddonOperator implements Operator {
  constructor(
    private readonly indicator: AddonIndicatorClient,
    private readonly repository: AddonEnabledRepository,
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  async run(): Promise<void> {
    const enabled = !this.repository.get();
    this.repository.set(enabled);
    if (enabled) {
      this.consoleFramePresenter.attach();
    } else {
      this.consoleFramePresenter.detach();
    }
    await this.indicator.setEnabled(enabled);
  }
}
