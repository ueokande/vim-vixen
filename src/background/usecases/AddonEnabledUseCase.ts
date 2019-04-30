import IndicatorPresenter from '../presenters/IndicatorPresenter';
import TabPresenter from '../presenters/TabPresenter';
import ContentMessageClient from '../infrastructures/ContentMessageClient';

export default class AddonEnabledUseCase {
  constructor() {
    this.indicatorPresentor = new IndicatorPresenter();

    this.indicatorPresentor.onClick(tab => this.onIndicatorClick(tab.id));

    this.tabPresenter = new TabPresenter();
    this.tabPresenter.onSelected(info => this.onTabSelected(info.tabId));

    this.contentMessageClient = new ContentMessageClient();
  }

  indicate(enabled) {
    return this.indicatorPresentor.indicate(enabled);
  }

  onIndicatorClick(tabId) {
    return this.contentMessageClient.toggleAddonEnabled(tabId);
  }

  async onTabSelected(tabId) {
    let enabled = await this.contentMessageClient.getAddonEnabled(tabId);
    return this.indicatorPresentor.indicate(enabled);
  }
}
