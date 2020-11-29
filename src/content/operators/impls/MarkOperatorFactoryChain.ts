import { inject, injectable } from "tsyringe";
import EnableSetMarkOperator from "./EnableSetMarkOperator";
import EnableJumpMarkOperator from "./EnableJumpMarkOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import MarkKeyRepository from "../../repositories/MarkKeyRepository";
import * as operations from "../../../shared/operations";

@injectable()
export default class MarkOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("MarkKeyRepository")
    private readonly markKeyRepository: MarkKeyRepository
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.MARK_SET_PREFIX:
        return new EnableSetMarkOperator(this.markKeyRepository);
      case operations.MARK_JUMP_PREFIX:
        return new EnableJumpMarkOperator(this.markKeyRepository);
    }
    return null;
  }
}
