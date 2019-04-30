import MarkUseCase from '../usecases/MarkUseCase';

export default class MarkController {
  constructor() {
    this.markUseCase = new MarkUseCase();
  }

  setGlobal(key, x, y) {
    this.markUseCase.setGlobal(key, x, y);
  }

  jumpGlobal(key) {
    this.markUseCase.jumpGlobal(key);
  }
}
