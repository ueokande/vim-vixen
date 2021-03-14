import { injectable } from "tsyringe";
import MemoryStorage from "../infrastructures/MemoryStorage";

const FIND_KEYWORD_KEY = "find-keyword";

@injectable()
export default class FindRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  getKeyword(): Promise<string> {
    return Promise.resolve(this.cache.get(FIND_KEYWORD_KEY));
  }

  setKeyword(keyword: string): Promise<void> {
    this.cache.set(FIND_KEYWORD_KEY, keyword);
    return Promise.resolve();
  }
}
