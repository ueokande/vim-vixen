import MarkUseCase from '../usecases/MarkUseCase';
import MarkKeyyUseCase from '../usecases/MarkKeyUseCase';
import Key from '../domains/Key';

export default class MarkKeyController {
  private markUseCase: MarkUseCase;

  private markKeyUseCase: MarkKeyyUseCase;

  constructor({
    markUseCase = new MarkUseCase(),
    markKeyUseCase = new MarkKeyyUseCase(),
  } = {}) {
    this.markUseCase = markUseCase;
    this.markKeyUseCase = markKeyUseCase;
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
