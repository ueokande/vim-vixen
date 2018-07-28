import VersionInteractor from '../usecases/version';

export default class VersionController {
  constructor() {
    this.versionInteractor = new VersionInteractor();
  }

  notifyIfUpdated() {
    this.versionInteractor.notifyIfUpdated();
  }
}
