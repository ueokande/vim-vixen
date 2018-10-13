import SettingRepository from '../repositories/setting';
import TabPresenter from '../presenters/tab';

export default class LinkInteractor {
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
