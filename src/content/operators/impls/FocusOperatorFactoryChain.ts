import { inject, injectable } from "tsyringe";
import OperatorFactoryChain from "../OperatorFactoryChain";
import Operator from "../Operator";
import FocusOperator from "./FocusOperator";
import FocusPresenter from "../../presenters/FocusPresenter";
import * as operations from "../../../shared/operations";

@injectable()
export default class FocusOperatorFactoryChain implements OperatorFactoryChain {
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
