import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class SelectTabNextOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tabs = await this.tabPresenter.getAll();
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index + 1) % tabs.length;
    return this.tabPresenter.select(tabs[select].id as number);
  }
}
