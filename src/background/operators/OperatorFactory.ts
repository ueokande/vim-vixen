import Operator from "./Operator";
import { Operation } from "../../shared/operations";

export default interface OperatorFactory {
  create(op: Operation): Operator;
}
