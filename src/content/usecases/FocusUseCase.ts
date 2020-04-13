import { injectable, inject } from "tsyringe";
import FocusPresenter from "../presenters/FocusPresenter";

@injectable()
export default class FocusUseCases {
  constructor(@inject("FocusPresenter") private presenter: FocusPresenter) {}

  focusFirstInput() {
    this.presenter.focusFirstElement();
  }
}
