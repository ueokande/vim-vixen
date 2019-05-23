import { injectable } from 'tsyringe';
import NavigateClient from '../clients/NavigateClient';
import TabPresenter from '../presenters/TabPresenter';

@injectable()
export default class NavigateUseCase {
  constructor(
    private tabPresenter: TabPresenter,
    private navigateClient: NavigateClient,
  ) {
  }

  async openHistoryNext(): Promise<void> {
    let tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.historyNext(tab.id!!);
  }

  async openHistoryPrev(): Promise<void> {
    let tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.historyPrev(tab.id!!);
  }

  async openLinkNext(): Promise<void> {
    let tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.linkNext(tab.id!!);
  }

  async openLinkPrev(): Promise<void> {
    let tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.linkPrev(tab.id!!);
  }

  openParent(): Promise<void> {
    throw new Error('not implemented');
  }

  openRoot(): Promise<void> {
    throw new Error('not implemented');
  }
}
