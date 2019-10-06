import { injectable } from 'tsyringe';
import MarkUseCase from '../usecases/MarkUseCase';
import MarkKeyyUseCase from '../usecases/MarkKeyUseCase';
import Key from '../../shared/settings/Key';

@injectable()
export default class MarkKeyController {
  constructor(
    private markUseCase: MarkUseCase,
    private markKeyUseCase: MarkKeyyUseCase,
  ) {
  }

  press(key: Key): boolean {
    if (this.markKeyUseCase.isSetMode()) {
      this.markUseCase.set(key.key);
      this.markKeyUseCase.disableSetMode();
      return true;
    }
    if (this.markKeyUseCase.isJumpMode()) {
      this.markUseCase.jump(key.key);
      this.markKeyUseCase.disableJumpMode();
      return true;
    }
    return false;
  }
}
