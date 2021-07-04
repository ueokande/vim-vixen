import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import RepeatLastOperator from "./RepeatLastOperator";
import RepeatRepository from "../../repositories/RepeatRepository";
import OperatorFactory from "../OperatorFactory";
import * as operations from "../../../shared/operations";

@injectable()
export default class RepeatOperatorFactoryChain
  implements OperatorFactoryChain
{
  constructor(
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository,
    @inject("OperatorFactory")
    private readonly operatorFactory: OperatorFactory
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.REPEAT_LAST:
        return new RepeatLastOperator(
          this.repeatRepository,
          this.operatorFactory
        );
    }
    return null;
  }
}
