import Operator from "../Operator";
import FindMasterClient from "../../client/FindMasterClient";

export default class FindNextOperator implements Operator {
  constructor(
    private readonly findMasterClient: FindMasterClient,
    private readonly repeat: number
  ) {}

  async run(): Promise<void> {
    for (let i = 0; i < this.repeat; ++i) {
      this.findMasterClient.findNext();
    }
  }
}
