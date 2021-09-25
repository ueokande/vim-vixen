import MemoryStorage from "../infrastructures/MemoryStorage";

const REPOSITORY_KEY = "readyFrameRepository";

type State = { [tabId: number]: number[] };

export default interface ReadyFrameRepository {
  clearFrameIds(tabId: number): Promise<void>;

  addFrameId(tabId: number, frameId: number): Promise<void>;

  removeFrameId(tabId: number, frameId: number): Promise<void>;

  getFrameIds(tabId: number): Promise<number[] | undefined>;
}

export class ReadyFrameRepositoryImpl implements ReadyFrameRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  clearFrameIds(tabId: number): Promise<void> {
    let state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      state = {};
    }
    delete state[tabId];
    this.cache.set(REPOSITORY_KEY, state);
    return Promise.resolve();
  }

  addFrameId(tabId: number, frameId: number): Promise<void> {
    let state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      state = {};
    }
    state[tabId] = (state[tabId] || []).concat(frameId).sort();
    this.cache.set(REPOSITORY_KEY, state);
    return Promise.resolve();
  }

  removeFrameId(tabId: number, frameId: number): Promise<void> {
    const state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      return Promise.resolve();
    }
    const ids = state[tabId];
    if (typeof ids === "undefined") {
      return Promise.resolve();
    }
    state[tabId] = ids.filter((id) => id != frameId);
    this.cache.set(REPOSITORY_KEY, state);
    return Promise.resolve();
  }

  getFrameIds(tabId: number): Promise<number[] | undefined> {
    const state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(state[tabId]);
  }
}
