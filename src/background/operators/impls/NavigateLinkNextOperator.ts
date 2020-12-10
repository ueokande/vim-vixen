import Operator from "../Operator";
import NavigateClient from "../../clients/NavigateClient";
import TabPresenter from "../../presenters/TabPresenter";

export default class NavigateLinkNextOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly navigateClient: NavigateClient
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.linkNext(tab.id!);
  }
}
