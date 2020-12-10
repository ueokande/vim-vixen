import Operator from "./Operator";
import { Operation } from "../../shared/operations";

export default interface OperatorFactoryChain {
  create(op: Operation): Operator | null;
}
