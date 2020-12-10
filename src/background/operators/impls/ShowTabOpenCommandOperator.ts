import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import ConsoleClient from "../../infrastructures/ConsoleClient";

export default class ShowTabOpenCommandOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly consoleClient: ConsoleClient,
    private readonly alter: boolean
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    let command = "tabopen ";
    if (this.alter) {
      command += tab.url || "";
    }
    return this.consoleClient.showCommand(tab.id as number, command);
  }
}
