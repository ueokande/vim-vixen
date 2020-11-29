import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class DuplicateTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    await this.tabPresenter.duplicate(tab.id as number);
  }
}
