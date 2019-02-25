import VersionInteractor from '../usecases/version';

export default class VersionController {
  constructor() {
    this.versionInteractor = new VersionInteractor();
  }

  notifyIfUpdated() {
    browser.runtime.onInstalled.addListener(() => {
      return this.versionInteractor.notify();
    });
  }
}
