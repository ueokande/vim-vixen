import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import FindNextOperator from "./FindNextOperator";
import FindPrevOperator from "./FindPrevOperator";
import FindMasterClient from "../../client/FindMasterClient";
import * as operations from "../../../shared/operations";

@injectable()
export default class FindOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("FindMasterClient")
    private readonly findMasterClient: FindMasterClient
  ) {}

  create(op: operations.Operation, repeat: number): Operator | null {
    switch (op.type) {
      case operations.FIND_NEXT:
        return new FindNextOperator(this.findMasterClient, repeat);
      case operations.FIND_PREV:
        return new FindPrevOperator(this.findMasterClient, repeat);
    }
    return null;
  }
}
