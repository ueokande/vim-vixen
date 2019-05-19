import NavigationPresenter, { NavigationPresenterImpl }
  from '../presenters/NavigationPresenter';

export default class NavigateUseCase {
  private navigationPresenter: NavigationPresenter;

  constructor({
    navigationPresenter = new NavigationPresenterImpl(),
  } = {}) {
    this.navigationPresenter = navigationPresenter;
  }

  openHistoryPrev(): void {
    this.navigationPresenter.openHistoryPrev();
  }

  openHistoryNext(): void {
    this.navigationPresenter.openHistoryNext();
  }

  openLinkPrev(): void {
    this.navigationPresenter.openLinkPrev();
  }

  openLinkNext(): void {
    this.navigationPresenter.openLinkNext();
  }

  openParent(): void {
    this.navigationPresenter.openParent();
  }

  openRoot(): void {
    this.navigationPresenter.openRoot();
  }
}
