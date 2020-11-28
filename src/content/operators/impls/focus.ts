import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import FocusPresenter from "../../presenters/FocusPresenter";
import * as operations from "../../../shared/operations";

export class FocusOperator implements Operator {
  constructor(private readonly presenter: FocusPresenter) {}

  async run(): Promise<void> {
    this.presenter.focusFirstElement();
  }
}

@injectable()
export class FocusOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("FocusPresenter")
    private readonly focusPresenter: FocusPresenter
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.FOCUS_INPUT:
        return new FocusOperator(this.focusPresenter);
    }
    return null;
  }
}
