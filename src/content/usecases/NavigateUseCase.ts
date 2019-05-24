import { injectable, inject } from 'tsyringe';
import NavigationPresenter from '../presenters/NavigationPresenter';

@injectable()
export default class NavigateUseCase {
  constructor(
    @inject('NavigationPresenter')
    private navigationPresenter: NavigationPresenter,
  ) {
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
}
