import { inject, injectable } from "tsyringe";
import StartFollowOperator from "./StartFollowOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import FollowMasterClient from "../../client/FollowMasterClient";
import * as operations from "../../../shared/operations";

@injectable()
export default class FollowOperatorFactoryChain
  implements OperatorFactoryChain {
  constructor(
    @inject("FollowMasterClient")
    private followMasterClient: FollowMasterClient
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.FOLLOW_START:
        return new StartFollowOperator(
          this.followMasterClient,
          op.newTab,
          op.background
        );
    }
    return null;
  }
}
