import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import ConsoleClient from "../../infrastructures/ConsoleClient";

export default class ShowBufferCommandOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly consoleClient: ConsoleClient
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const command = "buffer ";
    return this.consoleClient.showCommand(tab.id as number, command);
  }
}
