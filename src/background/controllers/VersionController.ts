import VersionUseCase from '../usecases/VersionUseCase';

export default class VersionController {
  private versionUseCase: VersionUseCase;

  constructor() {
    this.versionUseCase = new VersionUseCase();
  }

  notify(): void {
    return this.versionUseCase.notify();
  }
}
