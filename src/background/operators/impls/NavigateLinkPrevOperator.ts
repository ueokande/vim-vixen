import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import NavigateClient from "../../clients/NavigateClient";

export default class NavigateLinkPrevOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly navigateClient: NavigateClient
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    await this.navigateClient.linkPrev(tab.id!);
  }
}
