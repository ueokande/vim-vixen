import { injectable } from 'tsyringe';
import VersionUseCase from '../usecases/VersionUseCase';

@injectable()
export default class VersionController {
  constructor(
    private versionUseCase: VersionUseCase,
  ) {
  }

  notify(): Promise<void> {
    return this.versionUseCase.notify();
  }
}
