import * as operations from "../../shared/operations";
import Operator from "./Operator";

export default interface OperatorFactory {
  create(op: operations.Operation, repeat: number): Operator;
}
