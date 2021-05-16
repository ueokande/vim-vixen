import { inject, delay, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactory from "../OperatorFactory";
import OperatorFactoryChain from "../OperatorFactoryChain";
import CommandOperatorFactoryChain from "./CommandOperatorFactoryChain";
import InternalOperatorFactoryChain from "./InternalOperatorFactoryChain";
import NavigateOperatorFactoryChain from "./NavigateOperatorFactoryChain";
import RepeatOperatorFactoryChain from "./RepeatOperatorFactoryChain";
import TabOperatorFactoryChain from "./TabOperatorFactoryChain";
import ZoomOperatorFactoryChain from "./ZoomOperatorFactoryChain";
import FindOperatorFactoryChain from "./FindOperatorFactoryChain";
import * as operations from "../../../shared/operations";

@injectable()
export class OperatorFactoryImpl implements OperatorFactory {
  private readonly factoryChains: OperatorFactoryChain[];

  constructor(
    commandOperatorFactoryChain: CommandOperatorFactoryChain,
    internalOperatorFactoryChain: InternalOperatorFactoryChain,
    navigateOperatorFactoryChain: NavigateOperatorFactoryChain,
    tabOperatorFactoryChain: TabOperatorFactoryChain,
    zoomOperatorFactoryChain: ZoomOperatorFactoryChain,
    findOperatorFactoryChain: FindOperatorFactoryChain,
    @inject(delay(() => RepeatOperatorFactoryChain))
    repeatOperatorFactoryChain: RepeatOperatorFactoryChain
  ) {
    this.factoryChains = [
      commandOperatorFactoryChain,
      internalOperatorFactoryChain,
      navigateOperatorFactoryChain,
      repeatOperatorFactoryChain,
      tabOperatorFactoryChain,
      zoomOperatorFactoryChain,
      findOperatorFactoryChain,
    ];
  }

  create(op: operations.Operation): Operator {
    for (const chain of this.factoryChains) {
      const operator = chain.create(op);
      if (operator !== null) {
        return operator;
      }
    }
    throw new Error("unknown operation: " + op.type);
  }
}
