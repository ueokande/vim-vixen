import Operator from "../Operator";
import OperationClient from "../../client/OperationClient";
import * as operations from "../../../shared/operations";

export default class BackgroundOperationOperator implements Operator {
  constructor(
    private readonly operationClient: OperationClient,
    private readonly repeat: number,
    private readonly op: operations.Operation
  ) {}

  async run(): Promise<void> {
    await this.operationClient.execBackgroundOp(this.repeat, this.op);
  }
}
