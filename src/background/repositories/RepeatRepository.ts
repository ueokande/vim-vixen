import { injectable } from "tsyringe";
import { Operation } from "../../shared/operations";
import MemoryStorage from "../infrastructures/MemoryStorage";

const REPEAT_KEY = "repeat";

export default interface RepeatRepository {
  getLastOperation(): Operation | undefined;

  setLastOperation(op: Operation): void;
}

@injectable()
export class RepeatRepositoryImpl implements RepeatRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  getLastOperation(): Operation | undefined {
    return this.cache.get(REPEAT_KEY);
  }

  setLastOperation(op: Operation): void {
    this.cache.set(REPEAT_KEY, op);
  }
}
