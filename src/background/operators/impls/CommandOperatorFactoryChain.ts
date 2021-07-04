import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ShowCommandOperator from "./ShowCommandOperator";
import ShowOpenCommandOperator from "./ShowOpenCommandOperator";
import ShowTabOpenCommandOperator from "./ShowTabOpenCommandOperator";
import ShowWinOpenCommandOperator from "./ShowWinOpenCommandOperator";
import ShowBufferCommandOperator from "./ShowBufferCommandOperator";
import ShowAddBookmarkOperator from "./ShowAddBookmarkOperator";
import TabPresenter from "../../presenters/TabPresenter";
import ConsoleClient from "../../infrastructures/ConsoleClient";
import * as operations from "../../../shared/operations";
import StartFindOperator from "./StartFindOperator";

@injectable()
export default class CommandOperatorFactoryChain
  implements OperatorFactoryChain
{
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.COMMAND_SHOW:
        return new ShowCommandOperator(this.tabPresenter, this.consoleClient);
      case operations.COMMAND_SHOW_OPEN:
        return new ShowOpenCommandOperator(
          this.tabPresenter,
          this.consoleClient,
          op.alter
        );
      case operations.COMMAND_SHOW_TABOPEN:
        return new ShowTabOpenCommandOperator(
          this.tabPresenter,
          this.consoleClient,
          op.alter
        );
      case operations.COMMAND_SHOW_WINOPEN:
        return new ShowWinOpenCommandOperator(
          this.tabPresenter,
          this.consoleClient,
          op.alter
        );
      case operations.COMMAND_SHOW_BUFFER:
        return new ShowBufferCommandOperator(
          this.tabPresenter,
          this.consoleClient
        );
      case operations.COMMAND_SHOW_ADDBOOKMARK:
        return new ShowAddBookmarkOperator(
          this.tabPresenter,
          this.consoleClient,
          op.alter
        );
      case operations.FIND_START:
        return new StartFindOperator(this.tabPresenter, this.consoleClient);
    }
    return null;
  }
}
