import IndicatorPresenter from '../presenters/IndicatorPresenter';
import TabPresenter from '../presenters/TabPresenter';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

export default class AddonEnabledUseCase {
  private indicatorPresentor: IndicatorPresenter;

  private tabPresenter: TabPresenter;

  private contentMessageClient: ContentMessageClient;

  constructor() {
    this.indicatorPresentor = new IndicatorPresenter();

    this.indicatorPresentor.onClick((tab) => {
      if (tab.id) {
        this.onIndicatorClick(tab.id);
      }
    });

    this.tabPresenter = new TabPresenter();
    this.tabPresenter.onSelected(info => this.onTabSelected(info.tabId));

    this.contentMessageClient = new ContentMessageClient();
  }

  indicate(enabled: boolean): Promise<void> {
    return this.indicatorPresentor.indicate(enabled);
  }

  onIndicatorClick(tabId: number): Promise<void> {
    return this.contentMessageClient.toggleAddonEnabled(tabId);
  }

  async onTabSelected(tabId: number): Promise<void> {
    let enabled = await this.contentMessageClient.getAddonEnabled(tabId);
    return this.indicatorPresentor.indicate(enabled);
  }
}
