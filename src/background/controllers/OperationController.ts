import { inject, injectable } from "tsyringe";
import * as operations from "../../shared/operations";
import OperatorFactory from "../operators/OperatorFactory";
import RepeatUseCase from "../usecases/RepeatUseCase";

@injectable()
export default class OperationController {
  constructor(
    private readonly repeatUseCase: RepeatUseCase,
    @inject("OperatorFactory")
    private readonly operatorFactory: OperatorFactory
  ) {}

  async exec(repeat: number, op: operations.Operation): Promise<any> {
    await this.doOperation(repeat, op);
    if (this.repeatUseCase.isRepeatable(op)) {
      this.repeatUseCase.storeLastOperation(op);
    }
  }

  private async doOperation(
    repeat: number,
    operation: operations.Operation
  ): Promise<any> {
    const operator = this.operatorFactory.create(operation);
    for (let i = 0; i < repeat; ++i) {
      // eslint-disable-next-line no-await-in-loop
      await operator.run();
    }
  }
}
