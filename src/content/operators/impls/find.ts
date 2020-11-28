import { inject, injectable } from "tsyringe";
import RepeatOperator from "./RepeatOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import FindMasterClient from "../../client/FindMasterClient";
import * as operations from "../../../shared/operations";

export class FindNextOperator implements Operator {
  constructor(private readonly findMasterClient: FindMasterClient) {}

  async run(): Promise<void> {
    this.findMasterClient.findNext();
  }
}

export class FindPrevOperator implements Operator {
  constructor(private readonly findMasterClient: FindMasterClient) {}

  async run(): Promise<void> {
    this.findMasterClient.findPrev();
  }
}

@injectable()
export class FindOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("FindMasterClient")
    private readonly findMasterClient: FindMasterClient
  ) {}
  create(op: operations.Operation, repeat: number): Operator | null {
    switch (op.type) {
      case operations.FIND_NEXT:
        return new RepeatOperator(
          new FindNextOperator(this.findMasterClient),
          repeat
        );
      case operations.FIND_PREV:
        return new RepeatOperator(
          new FindPrevOperator(this.findMasterClient),
          repeat
        );
    }
    return null;
  }
}
