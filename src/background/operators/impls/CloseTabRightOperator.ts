import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class CloseTabRightOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tabs = await this.tabPresenter.getAll();
    tabs.sort((t1, t2) => t1.index - t2.index);
    const index = tabs.findIndex((t) => t.active);
    if (index < 0) {
      return;
    }
    for (let i = index + 1; i < tabs.length; ++i) {
      const tab = tabs[i];
      if (!tab.pinned) {
        await this.tabPresenter.remove([tab.id as number]);
      }
    }
  }
}
