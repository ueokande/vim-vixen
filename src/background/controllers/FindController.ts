import { injectable } from "tsyringe";
import StartFindUseCase from "../usecases/StartFindUseCase";

@injectable()
export default class FindController {
  constructor(private startFindUseCase: StartFindUseCase) {}

  startFind(tabId: number, keyword?: string): Promise<void> {
    return this.startFindUseCase.startFind(tabId, keyword);
  }
}
