import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class ToggleReaderOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.toggleReaderMode(tab.id as number);
  }
}
