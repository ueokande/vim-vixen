import SettingRepository from '../repositories/SettingRepository';
import TabPresenter from '../presenters/TabPresenter';

export default class LinkUseCase {
  constructor() {
    this.settingRepository = new SettingRepository();
    this.tabPresenter = new TabPresenter();
  }

  openToTab(url, tabId) {
    return this.tabPresenter.open(url, tabId);
  }

  openNewTab(url, openerId, background) {
    return this.tabPresenter.create(url, {
      openerTabId: openerId, active: !background
    });
  }
}
