import Operator from "../Operator";

export default class RepeatOperator implements Operator {
  constructor(
    private readonly operator: Operator,
    private readonly repeat: number
  ) {}

  async run(): Promise<void> {
    for (let i = 0; i < this.repeat; ++i) {
      this.operator.run();
    }
  }
}
