import Operator from "../Operator";
import MarkKeyRepository from "../../repositories/MarkKeyRepository";

export default class EnableSetMarkOperator implements Operator {
  constructor(private readonly repository: MarkKeyRepository) {}

  async run(): Promise<void> {
    this.repository.enableSetMode();
  }
}
