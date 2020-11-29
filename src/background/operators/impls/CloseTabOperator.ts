import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";

export default class CloseTabOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly force: boolean = false,
    private readonly selectLeft: boolean = false
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    if (!this.force && tab.pinned) {
      return Promise.resolve();
    }
    if (this.selectLeft && tab.index > 0) {
      const tabs = await this.tabPresenter.getAll();
      await this.tabPresenter.select(tabs[tab.index - 1].id as number);
    }
    return this.tabPresenter.remove([tab.id as number]);
  }
}
