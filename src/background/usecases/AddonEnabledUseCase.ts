import { inject, injectable } from 'tsyringe';
import IndicatorPresenter from '../presenters/IndicatorPresenter';
import TabPresenter from '../presenters/TabPresenter';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

@injectable()
export default class AddonEnabledUseCase {
  constructor(
    private indicatorPresentor: IndicatorPresenter,
    @inject("TabPresenter") private tabPresenter: TabPresenter,
    private contentMessageClient: ContentMessageClient,
  ) {
    this.indicatorPresentor.onClick((tab) => {
      if (tab.id) {
        this.onIndicatorClick(tab.id);
      }
    });
    this.tabPresenter.onSelected(info => this.onTabSelected(info.tabId));
  }

  indicate(enabled: boolean): Promise<void> {
    return this.indicatorPresentor.indicate(enabled);
  }

  onIndicatorClick(tabId: number): Promise<void> {
    return this.contentMessageClient.toggleAddonEnabled(tabId);
  }

  async onTabSelected(tabId: number): Promise<void> {
    const enabled = await this.contentMessageClient.getAddonEnabled(tabId);
    return this.indicatorPresentor.indicate(enabled);
  }
}
