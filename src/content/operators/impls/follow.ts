import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import FollowMasterClient from "../../client/FollowMasterClient";
import * as operations from "../../../shared/operations";

export class StartFollowOperator implements Operator {
  constructor(
    private readonly followMasterClient: FollowMasterClient,
    private readonly newTab: boolean,
    private readonly background: boolean
  ) {}

  async run(): Promise<void> {
    this.followMasterClient.startFollow(this.newTab, this.background);
  }
}

@injectable()
export class FollowOperatorFactoryChain implements OperatorFactoryChain {
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
