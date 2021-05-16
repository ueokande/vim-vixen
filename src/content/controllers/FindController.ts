import { injectable } from "tsyringe";
import FindUseCase, { RangeData } from "../usecases/FindUseCase";

@injectable()
export default class FindController {
  constructor(private findUseCase: FindUseCase) {}

  selectKeyword(rangeData: RangeData) {
    this.findUseCase.selectKeyword(rangeData);
  }
}
