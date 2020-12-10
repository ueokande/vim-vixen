import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class SelectPreviousSelectedTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tabId = await this.tabPresenter.getLastSelectedId();
    if (tabId === null || typeof tabId === "undefined") {
      return Promise.resolve();
    }
    return this.tabPresenter.select(tabId);
  }
}
