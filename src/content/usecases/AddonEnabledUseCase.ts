import { injectable, inject } from "tsyringe";
import AddonIndicatorClient from "../client/AddonIndicatorClient";
import AddonEnabledRepository from "../repositories/AddonEnabledRepository";
import ConsoleFramePresenter from "../presenters/ConsoleFramePresenter";

@injectable()
export default class AddonEnabledUseCase {
  constructor(
    @inject("AddonIndicatorClient")
    private readonly indicator: AddonIndicatorClient,
    @inject("AddonEnabledRepository")
    private readonly repository: AddonEnabledRepository,
    @inject("ConsoleFramePresenter")
    private readonly consoleFramePresenter: ConsoleFramePresenter
  ) {}

  async enable(): Promise<void> {
    await this.setEnabled(true);
  }

  async disable(): Promise<void> {
    await this.setEnabled(false);
  }

  async toggle(): Promise<void> {
    const current = this.repository.get();
    await this.setEnabled(!current);
  }

  getEnabled(): boolean {
    return this.repository.get();
  }

  private async setEnabled(on: boolean): Promise<void> {
    this.repository.set(on);

    if (this.consoleFramePresenter.isTopWindow()) {
      if (on) {
        this.consoleFramePresenter.attach();
      } else {
        this.consoleFramePresenter.detach();
      }
    }
    await this.indicator.setEnabled(on);
  }
}
