import Operator from "../Operator";
import RepeatRepository from "../../repositories/RepeatRepository";
import OperatorFactory from "../OperatorFactory";

export default class RepeatLastOperator implements Operator {
  constructor(
    private readonly repeatRepository: RepeatRepository,
    private readonly operatorFactory: OperatorFactory
  ) {}

  run(): Promise<void> {
    const op = this.repeatRepository.getLastOperation();
    if (typeof op === "undefined") {
      return Promise.resolve();
    }
    return this.operatorFactory.create(op).run();
  }
}
