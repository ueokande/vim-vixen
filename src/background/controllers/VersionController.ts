import VersionUseCase from '../usecases/VersionUseCase';

export default class VersionController {
  private versionUseCase: VersionUseCase;

  constructor() {
    this.versionUseCase = new VersionUseCase();
  }

  notify(): Promise<void> {
    return this.versionUseCase.notify();
  }
}
