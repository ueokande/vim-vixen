import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class ReloadTabOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly cache: boolean
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.reload(tab.id as number, this.cache);
  }
}
