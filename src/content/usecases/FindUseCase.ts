import { inject, injectable } from "tsyringe";
import FindPresenter from "../presenters/FindPresenter";

export type RangeData = {
  startTextNodePos: number;
  endTextNodePos: number;
  startOffset: number;
  endOffset: number;
};

@injectable()
export default class FindUseCase {
  constructor(
    @inject("FindPresenter")
    private readonly findPresenter: FindPresenter
  ) {}

  selectKeyword(keyword: string, rangeData: RangeData): void {
    this.findPresenter.selectKeyword(keyword, rangeData);
  }
}
