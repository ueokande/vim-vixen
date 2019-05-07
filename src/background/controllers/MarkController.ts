import MarkUseCase from '../usecases/MarkUseCase';

export default class MarkController {
  private markUseCase: MarkUseCase;

  constructor() {
    this.markUseCase = new MarkUseCase();
  }

  setGlobal(key: string, x: number, y: number): Promise<any> {
    return this.markUseCase.setGlobal(key, x, y);
  }

  jumpGlobal(key: string): Promise<any> {
    return this.markUseCase.jumpGlobal(key);
  }
}
