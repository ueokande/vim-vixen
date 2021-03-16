import { injectable, inject } from "tsyringe";
import ConsoleFramePresenter from "../presenters/ConsoleFramePresenter";

@injectable()
export default class ConsoleFrameUseCase {
  constructor(
    @inject("ConsoleFramePresenter")
    private consoleFramePresenter: ConsoleFramePresenter
  ) {}

  unfocus() {
    window.focus();
    this.consoleFramePresenter.blur();
  }

  resize(width: number, height: number) {
    this.consoleFramePresenter.resize(width, height);
  }
}
