import TabPresenter from '../presenters/TabPresenter';

export default class LinkUseCase {
  private tabPresenter: TabPresenter;

  constructor() {
    this.tabPresenter = new TabPresenter();
  }

  openToTab(url: string, tabId: number): Promise<any> {
    return this.tabPresenter.open(url, tabId);
  }

  openNewTab(url: string, openerId: number, background: boolean): Promise<any> {
    // openerTabId not supported on Android
    let properties = typeof browser.tabs.Tab === "object" ?
      { openerTabId: openerId, active: !background } : { active: !background };
    return this.tabPresenter.create(url, properties);
  }
}
