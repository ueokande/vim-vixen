import { injectable } from 'tsyringe';
import { Operation } from '../../shared/operations';
import MemoryStorage from '../infrastructures/MemoryStorage';

const REPEAT_KEY = 'repeat';

@injectable()
export default class RepeatRepository {
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
