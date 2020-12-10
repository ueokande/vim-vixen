import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class SelectLastTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[tabs.length - 1].id as number);
  }
}
