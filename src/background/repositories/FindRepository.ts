import { injectable } from "tsyringe";
import MemoryStorage from "../infrastructures/MemoryStorage";

const FIND_GLOBAL_KEYWORD_KEY = "find-global-keyword";
const FIND_LOCAL_KEYWORD_KEY = "find-local-keyword";

export type FindState = {
  keyword: string;
  frameId: number;
};

export default interface FindRepository {
  getGlobalKeyword(): Promise<string | undefined>;

  setGlobalKeyword(keyword: string): Promise<void>;

  getLocalState(tabId: number): Promise<undefined | FindState>;

  setLocalState(tabId: number, state: FindState): Promise<void>;

  deleteLocalState(tabId: number): Promise<void>;
}

@injectable()
export class FindRepositoryImpl implements FindRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  getGlobalKeyword(): Promise<string | undefined> {
    return Promise.resolve(this.cache.get(FIND_GLOBAL_KEYWORD_KEY));
  }

  setGlobalKeyword(keyword: string): Promise<void> {
    this.cache.set(FIND_GLOBAL_KEYWORD_KEY, keyword);
    return Promise.resolve();
  }

  getLocalState(tabId: number): Promise<FindState | undefined> {
    let states = this.cache.get(FIND_LOCAL_KEYWORD_KEY);
    if (typeof states === "undefined") {
      states = {};
    }
    return Promise.resolve(states[tabId]);
  }

  setLocalState(tabId: number, state: FindState): Promise<void> {
    let states = this.cache.get(FIND_LOCAL_KEYWORD_KEY);
    if (typeof states === "undefined") {
      states = {};
    }
    states[tabId] = state;
    this.cache.set(FIND_LOCAL_KEYWORD_KEY, states);
    return Promise.resolve();
  }

  deleteLocalState(tabId: number): Promise<void> {
    const states = this.cache.get(FIND_LOCAL_KEYWORD_KEY);
    if (typeof states === "undefined") {
      return Promise.resolve();
    }
    delete states[tabId];
    this.cache.set(FIND_LOCAL_KEYWORD_KEY, states);
    return Promise.resolve();
  }
}
