import Operator from "../Operator";
import FindMasterClient from "../../client/FindMasterClient";

export default class FindPrevOperator implements Operator {
  constructor(private readonly findMasterClient: FindMasterClient) {}

  async run(): Promise<void> {
    this.findMasterClient.findPrev();
  }
}
