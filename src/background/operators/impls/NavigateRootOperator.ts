import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class NavigateRootOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const url = new URL(tab.url!);
    await this.tabPresenter.open(url.origin);
  }
}
