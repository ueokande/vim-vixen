import { injectable } from "tsyringe";
import FindUseCase, { RangeData } from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(private findUseCase: FindUseCase) {}

  selectKeyword(keyword: string, rangeData: RangeData) {
    this.findUseCase.selectKeyword(keyword, rangeData);
  }
}
