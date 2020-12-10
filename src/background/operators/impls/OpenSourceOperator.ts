import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class OpenSourceOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const url = "view-source:" + tab.url;
    await this.tabPresenter.create(url);
  }
}
