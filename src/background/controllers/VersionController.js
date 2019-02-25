import VersionUseCase from '../usecases/VersionUseCase';

export default class VersionController {
  constructor() {
    this.versionUseCase = new VersionUseCase();
  }

  notify() {
    this.versionUseCase.notify();
  }
}
