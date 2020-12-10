import Operator from "../Operator";
import WindowPresenter from "../../presenters/WindowPresenter";
import TabPresenter from "../../presenters/TabPresenter";

export default class InternalOpenURLOperator implements Operator {
  constructor(
    private readonly windowPresenter: WindowPresenter,
    private readonly tabPresenter: TabPresenter,
    private readonly url: string,
    private readonly newTab?: boolean,
    private readonly newWindow?: boolean
  ) {}

  async run(): Promise<void> {
    if (this.newWindow) {
      await this.windowPresenter.create(this.url);
    } else if (this.newTab) {
      await this.tabPresenter.create(this.url);
    } else {
      const tab = await this.tabPresenter.getCurrent();
      await this.tabPresenter.open(this.url, tab.id);
    }
  }
}
