import { injectable } from "tsyringe";
import MarkUseCase from "../usecases/MarkUseCase";

@injectable()
export default class MarkController {
  constructor(private markUseCase: MarkUseCase) {}

  setGlobal(key: string, x: number, y: number): Promise<void> {
    return this.markUseCase.setGlobal(key, x, y);
  }

  jumpGlobal(key: string): Promise<void> {
    return this.markUseCase.jumpGlobal(key);
  }
}
