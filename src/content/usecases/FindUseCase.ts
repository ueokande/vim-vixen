import { inject, injectable } from "tsyringe";
import FindPresenter from "../presenters/FindPresenter";

@injectable()
export default class FindUseCase {
  constructor(
    @inject("FindPresenter")
    private readonly findPresenter: FindPresenter
  ) {}

  findNext(keyword: string): boolean {
    return this.findPresenter.find(keyword, false);
  }

  findPrev(keyword: string): boolean {
    return this.findPresenter.find(keyword, true);
  }

  clearSelection() {
    this.findPresenter.clearSelection();
  }
}
