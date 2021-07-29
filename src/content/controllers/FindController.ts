import { injectable } from "tsyringe";
import FindUseCase from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(private findUseCase: FindUseCase) {}

  findNext(keyword: string): boolean {
    return this.findUseCase.findNext(keyword);
  }

  findPrev(keyword: string): boolean {
    return this.findUseCase.findPrev(keyword);
  }

  clearSelection() {
    return this.findUseCase.clearSelection();
  }
}
