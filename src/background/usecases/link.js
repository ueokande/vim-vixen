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

  async openNewTab(url, openerId, background) {
    let settings = await this.settingRepository.get();
    let { adjacenttab } = settings.properties;
    if (adjacenttab) {
      return this.tabPresenter.create(url, {
        openerTabId: openerId, active: !background
      });
    }
    return this.tabPresenter.create(url, {
      openerTabId: openerId, active: !background
    });
  }
}
