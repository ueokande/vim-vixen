import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import TabPresenter from "../../presenters/TabPresenter";
import * as operations from "../../../shared/operations";
import FindNextOperator from "./FindNextOperator";
import FindPrevOperator from "./FindPrevOperator";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import FramePresenter from "../../presenters/FramePresenter";
import ConsoleClient from "../../infrastructures/ConsoleClient";

@injectable()
export default class FindOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    @inject("FindRepository")
    private readonly findRepository: FindRepository,
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("FramePresenter")
    private readonly framePresenter: FramePresenter
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.FIND_NEXT:
        return new FindNextOperator(
          this.tabPresenter,
          this.findRepository,
          this.findClient,
          this.consoleClient,
          this.framePresenter
        );
      case operations.FIND_PREV:
        return new FindPrevOperator(
          this.tabPresenter,
          this.findRepository,
          this.findClient,
          this.consoleClient,
          this.framePresenter
        );
    }
    return null;
  }
}
