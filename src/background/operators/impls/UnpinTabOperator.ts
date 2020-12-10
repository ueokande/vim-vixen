import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class UnpinTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id as number, false);
  }
}
