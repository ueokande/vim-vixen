import FocusPresenter, { FocusPresenterImpl }
  from '../presenters/FocusPresenter';
export default class FocusUseCases {
  private presenter: FocusPresenter;

  constructor({
    presenter = new FocusPresenterImpl(),
  } = {}) {
    this.presenter = presenter;
  }

  focusFirstInput() {
    this.presenter.focusFirstElement();
  }
}
