import { inject, injectable } from "tsyringe";
import OperatorFactory from "../OperatorFactory";
import { AddonOperatorFactoryChain } from "./addons";
import { ClipboardOperatorFactoryChain } from "./clipboard";
import { FindOperatorFactoryChain } from "./find";
import { FocusOperatorFactoryChain } from "./focus";
import { MarkOperatorFactoryChain } from "./mark";
import { ScrollOperatorFactoryChain } from "./scroll";
import { FollowOperatorFactoryChain } from "./follow";
import BackgroundOperationOperator from "./BackgroundOperationOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import { Operation } from "../../../shared/operations";
import OperationClient from "../../client/OperationClient";

@injectable()
export default class OperatorFactoryImpl implements OperatorFactory {
  private readonly factoryChains: OperatorFactoryChain[];

  constructor(
    addonOperatorFactoryChain: AddonOperatorFactoryChain,
    clipboardOperatorFactoryChain: ClipboardOperatorFactoryChain,
    findOperatorFactoryChain: FindOperatorFactoryChain,
    focusOperatorFactoryChain: FocusOperatorFactoryChain,
    followOperatorFactoryChain: FollowOperatorFactoryChain,
    markOperatorFactoryChain: MarkOperatorFactoryChain,
    scrollOperatorFactoryChain: ScrollOperatorFactoryChain,
    @inject("OperationClient")
    private readonly operationClient: OperationClient
  ) {
    this.factoryChains = [
      addonOperatorFactoryChain,
      clipboardOperatorFactoryChain,
      findOperatorFactoryChain,
      focusOperatorFactoryChain,
      followOperatorFactoryChain,
      markOperatorFactoryChain,
      scrollOperatorFactoryChain,
    ];
  }

  create(op: Operation, repeat: number): Operator {
    for (const chain of this.factoryChains) {
      const operator = chain.create(op, repeat);
      if (operator != null) {
        return operator;
      }
    }
    return new BackgroundOperationOperator(this.operationClient, repeat, op);
  }
}
