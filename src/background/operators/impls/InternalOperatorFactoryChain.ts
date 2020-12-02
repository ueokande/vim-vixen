import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import CancelOperator from "./CancelOperator";
import InternalOpenURLOperator from "./InternalOpenURLOperator";
import TabPresenter from "../../presenters/TabPresenter";
import ConsoleClient from "../../infrastructures/ConsoleClient";
import WindowPresenter from "../../presenters/WindowPresenter";
import * as operations from "../../../shared/operations";

@injectable()
export default class InternalOperatorFactoryChain
  implements OperatorFactoryChain {
  constructor(
    private readonly windowPresenter: WindowPresenter,
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.CANCEL:
        return new CancelOperator(this.tabPresenter, this.consoleClient);
      case operations.INTERNAL_OPEN_URL:
        return new InternalOpenURLOperator(
          this.windowPresenter,
          this.tabPresenter,
          op.url,
          op.newTab,
          op.newWindow
        );
    }
    return null;
  }
}
