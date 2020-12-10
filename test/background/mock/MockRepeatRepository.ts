import RepeatRepository from "../../../src/background/repositories/RepeatRepository";
import { Operation } from "../../../src/shared/operations";

export default class MockRepeatRepository implements RepeatRepository {
  private op: Operation | undefined = undefined;

  getLastOperation(): Operation | undefined {
    return this.op;
  }

  setLastOperation(op: Operation): void {
    this.op = op;
  }
}
