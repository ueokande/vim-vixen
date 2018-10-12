import MarkInteractor from '../usecases/mark';

export default class MarkController {
  constructor() {
    this.markInteractor = new MarkInteractor();
  }

  setGlobal(key, x, y) {
    this.markInteractor.setGlobal(key, x, y);
  }

  jumpGlobal(key) {
    this.markInteractor.jumpGlobal(key);
  }
}
