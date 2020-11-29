import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class SelectFirstTabOperator implements Operator {
  constructor(private readonly tabPresenter: TabPresenter) {}

  async run(): Promise<void> {
    const tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[0].id as number);
  }
}
