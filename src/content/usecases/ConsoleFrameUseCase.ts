import ConsoleFramePresenter, { ConsoleFramePresenterImpl }
  from '../presenters/ConsoleFramePresenter';

export default class ConsoleFrameUseCase {
  private consoleFramePresenter: ConsoleFramePresenter;

  constructor({
    consoleFramePresenter = new ConsoleFramePresenterImpl(),
  } = {}) {
    this.consoleFramePresenter = consoleFramePresenter;
  }

  unfocus() {
    window.focus();
    this.consoleFramePresenter.blur();
  }
}
