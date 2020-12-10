import Operator from "../Operator";
import MarkKeyRepository from "../../repositories/MarkKeyRepository";

export default class EnableJumpMarkOperator implements Operator {
  constructor(private readonly repository: MarkKeyRepository) {}

  async run(): Promise<void> {
    this.repository.enableJumpMode();
  }
}
