import { injectable } from 'tsyringe';
import MarkUseCase from '../usecases/MarkUseCase';

@injectable()
export default class MarkController {
  constructor(
    private markUseCase: MarkUseCase,
  ) {
  }

  setGlobal(key: string, x: number, y: number): Promise<any> {
    return this.markUseCase.setGlobal(key, x, y);
  }

  jumpGlobal(key: string): Promise<any> {
    return this.markUseCase.jumpGlobal(key);
  }
}
