import VersionUseCase from '../usecases/VersionUseCase';

export default class VersionController {
  constructor() {
    this.versionUseCase = new VersionUseCase();
  }

  notifyIfUpdated() {
    this.versionUseCase.notifyIfUpdated();
  }
}
