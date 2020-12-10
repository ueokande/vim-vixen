import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class ReopenTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  run(): Promise<void> {
    return this.tabPresenter.reopen();
  }
}
