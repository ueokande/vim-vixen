import Operator from "../Operator";
import FocusPresenter from "../../presenters/FocusPresenter";

export default class FocusOperator implements Operator {
  constructor(private readonly presenter: FocusPresenter) {}

  async run(): Promise<void> {
    this.presenter.focusFirstElement();
  }
}
